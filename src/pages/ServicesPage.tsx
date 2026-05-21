import SectionHeading from '../components/SectionHeading'
import LeadForm from '../components/LeadForm'
import { services } from '../data/content'

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Services"
            title="Technical services for every operational need"
            description="Installation, calibration, AMC, training and support built for complex scientific environments."
          />
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-700">Service request</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">Submit your service inquiry to receive a tailored quote and implementation plan.</p>
        </div>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_0.8fr]">
        <div className="grid gap-6">
          {services.map(service => (
            <article key={service.id} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.32em] text-teal-700">{service.highlight}</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>
        <LeadForm />
      </div>
    </section>
  )
}
