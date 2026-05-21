import { Link } from 'react-router-dom'
import Button from '../components/Button'
import HeroSection from '../components/hero/HeroSection'
import SectionHeading from '../components/SectionHeading'
import { industries, services, solutions } from '../data/content'

export default function HomePage() {
  return (
    <div className="bg-slate-50">
      <HeroSection />
      <section className="mx-auto max-w-7xl space-y-16 px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-end lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Solutions"
              title="Solutions engineered for tomorrow"
              description="Premium lab design, automation and analytical systems curated for UAE enterprises and scientific organizations."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {solutions.map(item => (
              <article key={item.id} className="group rounded-[2rem] border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:border-brand-200">
                <p className="text-sm uppercase tracking-[0.35em] text-brand-700">{item.highlight}</p>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                <Link to="/solutions" className="mt-6 inline-flex text-sm font-semibold text-brand-700 transition group-hover:text-brand-900">
                  Learn more →
                </Link>
              </article>
            ))}
          </div>
        </div>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <div className="rounded-[2rem] bg-brand-900 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
            <p className="text-sm uppercase tracking-[0.35em] text-teal-200">Industries</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Trusted by UAE scientific leaders.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">
              We support research, pharma, food, environmental and academic organizations with systems built for scale and compliance.
            </p>
            <Link to="/industries" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-900 shadow-md shadow-slate-900/10 transition hover:bg-slate-100">
              Explore industries
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {industries.slice(0, 4).map(industry => (
              <div key={industry.id} className="rounded-[2rem] border border-slate-200 bg-white p-8">
                <h3 className="text-xl font-semibold text-slate-950">{industry.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Services"
                title="Services that keep your laboratory mission-ready"
                description="Installation, calibration, maintenance and support tailored for critical science operations."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.slice(0, 4).map(service => (
                <div key={service.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-brand-900">{service.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/contact">
              <Button variant="primary">Request service quote</Button>
            </Link>
            <Link to="/services">
              <Button variant="secondary">View services</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-teal-200">Why ProScient</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Partner with a science-first team for premium lab outcomes.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                We position technical insight, regulatory expertise and delivery excellence at the center of every project.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Compliance-led design', 'Custom engineering', 'Local support', 'Fast response'].map(item => (
                <div key={item} className="rounded-3xl bg-slate-900/90 p-5 text-sm text-slate-200">
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {['1.2M hours delivered', '88% customer retention', '500K samples processed'].map(metric => (
              <div key={metric} className="rounded-3xl bg-slate-900/80 p-6 text-center text-sm text-slate-200">
                <p className="text-2xl font-semibold text-white">{metric.split(' ')[0]}</p>
                <p className="mt-2 text-slate-400">{metric.replace(metric.split(' ')[0], '').trim()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-brand-900 px-10 py-12 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-teal-200">Ready to transform</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Book a consultation and bring your next lab project to life.</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button variant="primary">Get quote</Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary">Contact sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
