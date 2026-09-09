import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Product } from '../../entities/product.entity';

export interface ExtractedProduct {
  name: string;
  description: string;
  specifications: Array<{ key: string; value: string }>;
  application: string;
  isFeatured: boolean;
}

@Injectable()
export class AiService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY ?? '';
    if (!this.apiKey) {
      console.warn(
        'OPENROUTER_API_KEY is not set — AI extraction will fail.',
      );
    }
  }

  private isUrl(input: string): boolean {
    const trimmed = input.trim();
    try {
      const url = new URL(trimmed);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private htmlToText(html: string): string {
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<meta[\s\S]*?>/gi, '')
      .replace(/<link[\s\S]*?>/gi, '');

    text = text
      .replace(/<tr[^>]*>/gi, '\n')
      .replace(/<\/tr>/gi, '')
      .replace(/<th[^>]*>/gi, ' | ')
      .replace(/<\/th>/gi, '')
      .replace(/<td[^>]*>/gi, ' | ')
      .replace(/<\/td>/gi, '');

    text = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(
        /<\/?(p|div|h[1-6]|li|dt|dd|blockquote|article|section|main|header|footer|nav)[^>]*>/gi,
        '\n',
      )
      .replace(/<\/?(ul|ol|dl|table|thead|tbody|tfoot)[^>]*>/gi, '\n');

    text = text
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&deg;/gi, '°')
      .replace(/&plusmn;/gi, '±')
      .replace(/&micro;/gi, 'µ')
      .replace(/&Omega;/gi, 'Ω')
      .replace(/&times;/gi, '×')
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      );

    text = text.replace(/<[^>]+>/g, '');

    text = text
      .split('\n')
      .map((line) => line.replace(/[ \t]+/g, ' ').trim())
      .filter((line) => line.length > 0)
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');

    return text.trim();
  }

  private async fetchPageContent(url: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'identity',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new InternalServerErrorException(
          `Failed to fetch page: HTTP ${response.status} ${response.statusText}`,
        );
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (
        !contentType.includes('html') &&
        !contentType.includes('xml') &&
        !contentType.includes('text')
      ) {
        throw new InternalServerErrorException(
          `URL did not return an HTML page (content-type: ${contentType}).`,
        );
      }

      const html = await response.text();
      const text = this.htmlToText(html);

      if (text.length < 100) {
        throw new InternalServerErrorException(
          'The page returned almost no readable text. It may require JavaScript rendering. Please paste the product specifications as plain text instead.',
        );
      }

      return text;
    } finally {
      clearTimeout(timer);
    }
  }

  private async callOpenRouter(
    prompt: string,
    maxTokens: number,
  ): Promise<string> {
    const maxRetries = 3;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://psci-sol.com',
              'X-OpenRouter-Title': 'Proscient Product Catalog',
            },
            body: JSON.stringify({
              model: 'google/gemma-4-26b-a4b-it:free',
              messages: [{ role: 'user', content: prompt }],
              max_tokens: maxTokens,
              temperature: 0.2,
            }),
          },
        );

        if (!response.ok) {
          const body = await response.text();
          if (response.status === 429 && attempt < maxRetries) {
            await new Promise((r) =>
              setTimeout(r, 2000 * Math.pow(2, attempt)),
            );
            continue;
          }
          if (response.status === 429) {
            throw new ServiceUnavailableException(
              'OpenRouter API is rate limiting. Please try again in a minute.',
            );
          }
          throw new InternalServerErrorException(
            `OpenRouter API error (${response.status}): ${body.substring(0, 300)}`,
          );
        }

        const data = (await response.json()) as any;
        const content = data?.choices?.[0]?.message?.content ?? '';
        return content;
      } catch (err) {
        if (err instanceof InternalServerErrorException || err instanceof ServiceUnavailableException) {
          throw err;
        }
        const msg = (err as Error).message || '';
        if (msg.includes('429') && attempt < maxRetries) {
          await new Promise((r) =>
            setTimeout(r, 2000 * Math.pow(2, attempt)),
          );
          continue;
        }
        throw new InternalServerErrorException(
          `OpenRouter API error: ${msg}`,
        );
      }
    }
    return '';
  }

  async extractProduct(input: string): Promise<Partial<Product>> {
    if (!this.apiKey) {
      throw new InternalServerErrorException(
        'OPENROUTER_API_KEY environment variable is not set.',
      );
    }

    let sourceText = input.trim();
    let sourceNote = '';
    if (this.isUrl(sourceText)) {
      sourceText = await this.fetchPageContent(sourceText);
      sourceNote =
        'NOTE: The text below was extracted from a web page. Extract ONLY what is explicitly written here.';
    }

    const prompt = `TASK: Extract MAXIMUM product data from the text below into JSON. This is for a professional scientific equipment catalog. The source is often a marketing brochure WITHOUT a spec table — you must convert prose/features/performance data into structured specifications.

GOAL: Return 12-20 specifications minimum if the source is rich. Never return <5 specs for a long brochure. Empty specs are a FAILURE.

CRITICAL RULES:
1. Ground EVERYTHING in the source. Do NOT invent model numbers, but you MAY rephrase prose into "key: value" specs (e.g. prose "Octopole-style Collision Reaction Cell with helium for KED" → {"key":"Collision Reaction Cell","value":"Octopole-style, Helium gas, Kinetic Energy Discrimination (KED)"}).
2. If source has a spec table, extract EVERY row. If it has NO table, synthesize specs from: instrument type, analyzer, ion source, lenses/optics, cells, chambers, detector, plasma, sample introduction, performance numbers (LOD, R2, sensitivity), software features, applications.
3. NEVER output generic filler like "USB / RS-232", "CE / ISO 9001", "Operating range 0-100%" unless those exact strings appear. Instead use REAL facts from source.
4. Copy numbers/units exactly (ppb, cps, m/z, He sccm, etc.).

Return ONLY a valid JSON object:
{
  "name": "Full model name e.g. 'ACE 3000 ICP-MS'",
  "brand": "Manufacturer e.g. 'Young In ACE' (prefer manufacturer over distributor; if only distributor found use it)",
  "category": "Best fit: 'Mass Spectrometry' for ICP-MS/LC-MS/GC-MS, 'Chromatography' for HPLC/GC, 'Spectroscopy' for AAS/ICP-OES/UV, else 'Lab Equipment'",
  "description": "3-5 sentences, what it IS + key tech + capabilities, ONLY from source",
  "specifications": [
    { "key": "Parameter name", "value": "Value from source" }
  ],
  "application": "Comma-separated applications explicitly stated or clearly implied (e.g. Semiconductor, Environmental, Food, Pharmaceuticals, Cosmetics, Petrochemicals, Life Sciences, Nanoparticle analysis)",
  "isFeatured": false
}

HOW TO BUILD SPECIFICATIONS (aim 12-20):
- ALWAYS first 3 rows: Manufacturer, Model, Instrument Type (e.g. "Inductively Coupled Plasma Mass Spectrometer").
- Then one spec per subsystem mentioned: Mass Analyzer / Quadrupole Mass Filter, Collision Reaction Cell, Interface Chamber, Plasma Source, Sample Introduction System, Analyzer Chamber, Detector, Ion Lenses, Vacuum/Optics.
- Then performance specs: Detection Limits / LOD, Linearity / R2, Sensitivity, Dynamic Range, Matrix Tolerance, Interference Removal.
- Then application/method specs: Target Elements/Isotopes (e.g. 56Fe with 40Ar16O removal, 115In, 6Li, 175Lu), Sample Types.
- Example good specs for ACE 3000: {"key":"Collision Reaction Cell","value":"Octopole-style, Helium collision gas, KED, higher collision frequency than quadrupole/hexapole"}, {"key":"Mass Analyzer","value":"Custom Quadrupole Mass Filter, in-house RF/DC control, high straightness/parallelism"}, {"key":"Interface Chamber","value":"Patented, ion lenses tailored to matrix, removes metastable atoms/photons/argon"}, {"key":"Plasma Source","value":"Hyper Stable argon plasma; expertise in ICP, Microwave Induced Plasma, Dielectric Barrier Discharge"}, {"key":"LOD","value":"0.001 ppb for 115In, 6Li, 175Lu (10 replicates, blank)"}, etc.
- If a value is long prose, condense to <25 words but keep all technical nouns.

DESCRIPTION RULES:
- Start with full model + type. Include 3-4 key technologies + what it solves (e.g. polyatomic interferences from argon/solvents).
- No generic filler ("premium, high-precision for clinical labs") unless source says clinical.

Return ONLY the JSON object. No markdown fences, no explanation.

${sourceNote ? `${sourceNote}\n\n` : ''}SOURCE TEXT:
---
${sourceText.substring(0, 25000)}
---`;

    const rawText = await this.callOpenRouter(prompt, 8192);

    if (!rawText) {
      throw new InternalServerErrorException(
        'OpenRouter returned an empty response.',
      );
    }

    // Robust JSON extraction: strip fences, find first {...} block
    let cleaned = rawText.trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new InternalServerErrorException(
        `Could not parse AI response as JSON. Raw: ${cleaned.substring(0, 300)}`,
      );
    }

    const specs: Record<string, string> = {};
    if (Array.isArray(parsed.specifications)) {
      parsed.specifications.forEach((s: any) => {
        if (s && typeof s.key === 'string' && typeof s.value === 'string') {
          const k = s.key.trim();
          const v = s.value.trim();
          if (k && v) specs[k] = v;
        }
      });
    }

    return {
      name: String(parsed.name ?? 'Generated Product').trim(),
      brand: parsed.brand ? String(parsed.brand).trim() : undefined,
      category: parsed.category ? String(parsed.category).trim() : undefined,
      description: String(parsed.description ?? '').trim(),
      specs: specs,
      application: String(
        parsed.application ??
          'Scientific laboratory research as specified in extracted documentation.',
      ).trim(),
    } as Partial<Product>;
  }
}
