import SectionHeading from '../components/SectionHeading'
import { solutions } from '../data/content'

export default function SolutionsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <SectionHeading
            eyebrow="Solutions"
            title="Solutions for every lab need"
            description="Turnkey laboratory systems, automation and engineering services for high-performance scientific workflows."
          />
        </div>
        <div className="text-sm text-slate-600">
          <p>ProScient delivers tailored solutions across analytical, automation, and custom engineering domains with strong UAE local support.</p>
        </div>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {solutions.map(solution => (
          <article key={solution.id} className="group rounded-[2rem] border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:border-brand-200">
            <p className="text-sm uppercase tracking-[0.32em] text-brand-700">{solution.highlight}</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">{solution.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{solution.description}</p>
            <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-brand-700">
              <span>Learn more</span>
              <span>→</span>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-16 rounded-[2rem] bg-brand-900 px-10 py-12 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-teal-200">Turnkey lab systems</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Build a lab environment that scales with your objectives.</h2>
          </div>
          <div className="space-y-3 text-sm leading-7 text-slate-200">
            <p>Comprehensive design, instrumentation, installation and validation for research, pharmaceuticals and industrial laboratories.</p>
            <p>Advanced automation and data integration for consistent quality and predictive operations.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
