import SectionHeading from '../components/SectionHeading'
import { industries } from '../data/content'

export default function IndustriesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <SectionHeading
            eyebrow="Industries"
            title="Strategic laboratory solutions for critical sectors"
            description="ProScient serves oil & gas, pharma, food and beverage, environmental monitoring, and academic research with high-value lab systems."
          />
        </div>
        <div className="text-sm text-slate-600">
          <p>Each industry receives a tailored approach that meets local regulations and global best practices.</p>
        </div>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map(item => (
          <article key={item.id} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.32em] text-brand-700">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
