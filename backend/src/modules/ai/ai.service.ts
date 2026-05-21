import { Injectable } from '@nestjs/common';
import { Product } from '../../entities/product.entity';

@Injectable()
export class AiService {
  /**
   * Generates highly realistic scientific product specifications, descriptions,
   * and applications based on a product name and category.
   * Fully structured to easily drop-in Gemini or other LLM APIs in the future.
   */
  async generateProduct(name: string, category: string): Promise<Partial<Product>> {
    const nameLower = name.toLowerCase();
    const categoryLower = (category || '').toLowerCase();

    // Default template values
    let description = `The ProScient ${name} is a state-of-the-art laboratory system designed to deliver outstanding reliability, accuracy, and operational throughput for modern scientific laboratories. Engineered with premium components and featuring user-centric software integration, this system ensures compliant and reproducible outcomes.`;
    let application = 'Pharmaceutical QC, chemical testing, environmental compliance, and academic research.';
    let specs: Record<string, string> = {
      'Interface': 'Color touchscreen, LIMS-ready',
      'Power supply': '220-240V, 50/60Hz',
      'Compliance': 'ISO 9001, CE Certified',
      'Dimensions': '450 x 380 x 290 mm',
    };

    // 1. ANALYTICAL / SPECTROSCOPY KEYWORDS
    if (nameLower.includes('spectro') || nameLower.includes('photometer') || nameLower.includes('uv-vis') || categoryLower.includes('analytical')) {
      description = `The ProScient ${name} is an advanced UV-Vis/Optical spectrophotometer engineered for precise quantitative analysis in chemical research, environmental monitoring, and biochemistry. Its dual-beam optical design delivers outstanding wavelength precision, minimal stray light, and excellent baseline stability for critical measurements.`;
      application = 'Molecular quantification, purity analysis, DNA/RNA assay testing, and trace heavy metal detection in water.';
      specs = {
        'Wavelength range': '190–1100 nm (UV-Vis)',
        'Spectral bandwidth': '1.0 nm / 0.5 nm adjustable',
        'Wavelength accuracy': '±0.1 nm (at 656.1 nm)',
        'Stray light': '≤ 0.02% T (at 220 nm and 360 nm)',
        'Light source': 'Deuterium and Tungsten-Halogen lamps',
        'Detector': 'Dual silicon photodiodes',
        'Connectivity': 'USB, Ethernet, LIMS compliance',
      };
    }
    // 2. CHROMATOGRAPHY / LIQUID ANALYSIS KEYWORDS
    else if (nameLower.includes('chromatograph') || nameLower.includes('hplc') || nameLower.includes('gc-ms') || nameLower.includes('flow')) {
      description = `The ProScient ${name} chromatography interface provides ultra-high resolution chemical separations and analysis. Incorporating premium quaternary pumps and an optimized thermal column housing, this system enables high precision flow rates, rapid sample cycle times, and robust compliance documentation.`;
      application = 'Complex mixture separations, pharmaceutical batch release testing, biological biomarker analysis, and pesticide testing.';
      specs = {
        'Maximum pressure': '600 bar / 60 MPa',
        'Flow rate range': '0.001 to 10.000 mL/min',
        'Flow rate accuracy': '±0.07% or 2 µL/min',
        'Column oven range': 'Ambient +5°C to 80°C',
        'Sampler capacity': 'up to 120 standard vials (2.0 mL)',
        'Detector options': 'Diode Array Detector (DAD) / Mass Spectrometer (MS)',
      };
    }
    // 3. THERMAL / INCUBATION KEYWORDS
    else if (nameLower.includes('incubator') || nameLower.includes('oven') || nameLower.includes('furnace') || nameLower.includes('temp') || nameLower.includes('thermal')) {
      description = `The ProScient ${name} thermal conditioning system delivers highly homogeneous temperature environments with micro-processor PID controllers. Designed with advanced double-walled chamber insulation and dual-sensor safety shutoffs, it supports fragile cell line cultures and materials validation experiments.`;
      application = 'Microbiological cultures, biological incubation, material testing, aging tests, and sample heating storage.';
      specs = {
        'Chamber volume': '150 Liters',
        'Temperature range': 'Ambient +5°C to 80°C',
        'Temperature stability': '±0.1°C',
        'Temperature uniformity': '±0.3°C (at 37°C)',
        'CO2 sensor type': 'Infrared (IR) dual-beam (for incubator templates)',
        'Internal material': 'Satin-finish corrosion resistant Stainless Steel 304',
      };
    }
    // 4. CENTRIFUGATION KEYWORDS
    else if (nameLower.includes('centrifuge') || nameLower.includes('spin') || nameLower.includes('rotor')) {
      description = `The ProScient ${name} is a high-speed, microprocessor-controlled laboratory centrifuge engineered for cellular separations, protein precipitation, and clinical diagnostics. Featuring a robust brushless induction drive and an advanced aerosol-tight rotor sealing, it guarantees safe and silent operational cycles.`;
      application = 'Cellular harvesting, blood sample preparation, macromolecular precipitation, and diagnostic assays.';
      specs = {
        'Maximum speed': '15,000 RPM',
        'Maximum RCF': '21,380 x g',
        'Acceleration/Decel': '9 profiles selectable',
        'Rotor options': 'Angle rotor (24x2mL) or swing-out plate rotor',
        'Safety lock': 'Dual electronic lid interlock',
        'Cooling (if ref)': '-10°C to +40°C dynamic control',
      };
    }
    // 5. SMART LABS / AUTOMATION KEYWORDS
    else if (nameLower.includes('auto') || nameLower.includes('robotic') || nameLower.includes('bench') || nameLower.includes('workbench')) {
      description = `The ProScient ${name} is an automated, smart laboratory workstation designed to orchestrate complex liquid handling and analytical workflows. Featuring modular deck configurations and LIMS-connected task queues, it eliminates manual pipetting errors and scales up laboratory throughput.`;
      application = 'High-throughput liquid dispensing, serial dilutions, sample preparation, and robotic workflow scheduling.';
      specs = {
        'Handling speed': 'Up to 360 sample transfer actions/hour',
        'Volume range': '1.0 µL to 1000 µL with high CV precision',
        'Deck capacity': '9 standard ANSI/SLAS microplate positions',
        'Robotic arm': 'High-precision dual-axis gantry system',
        'Software API': 'OPC UA, REST, LabVIEW integration',
      };
    }

    // Return the generated partial product fields
    return {
      name,
      category: category || 'Lab Equipment',
      brand: 'AURA', // Default generated brand
      application,
      description,
      specs,
      pdf: '#',
      images: [],
    };
  }
}
