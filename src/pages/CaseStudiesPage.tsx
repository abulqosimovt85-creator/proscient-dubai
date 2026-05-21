import SectionHeading from '../components/SectionHeading'
import { caseStudies } from '../data/content'

export default function CaseStudiesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Case studies"
        title="Problem → Solution → Result"
        description="Real projects that demonstrate our approach to lab transformation, compliance and automation."
      />
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {caseStudies.map(caseStudy => (
          <article key={caseStudy.id} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.32em] text-brand-700">{caseStudy.industry}</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">{caseStudy.title}</h3>
            <p className="mt-5 text-sm leading-7 text-slate-600"><strong>Problem:</strong> {caseStudy.problem}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600"><strong>Solution:</strong> {caseStudy.solution}</p>
            <p className="mt-4 text-sm leading-7 text-slate-600"><strong>Result:</strong> {caseStudy.result}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
