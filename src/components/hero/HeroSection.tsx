import { Link } from 'react-router-dom'
import Button from '../Button'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(30,194,185,0.2),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_24%)] px-4 py-12 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-[10px] sm:text-sm uppercase tracking-[0.32em] text-slate-600 shadow-sm">
            ProScient | UAE lab solutions
          </div>
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-brand-900">Smart Science. Real Impact.</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
              Advanced scientific solutions for modern UAE laboratories.
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Enterprise-grade laboratory equipment, automation, and services designed to elevate research, compliance and production results.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full">Get a quote</Button>
            </Link>
            <Link to="/solutions" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full">Explore solutions</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 sm:p-5 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] sm:text-sm text-slate-500">Trusted by</p>
              <p className="mt-1 sm:mt-3 text-lg sm:text-xl font-semibold text-slate-950">UAE labs</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 sm:p-5 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] sm:text-sm text-slate-500">Projects delivered</p>
              <p className="mt-1 sm:mt-3 text-lg sm:text-xl font-semibold text-slate-950">45+</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 sm:p-5 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] sm:text-sm text-slate-500">Markets served</p>
              <p className="mt-1 sm:mt-3 text-lg sm:text-xl font-semibold text-slate-950">Pharma & industry</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 sm:p-5 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] sm:text-sm text-slate-500">Compliance focus</p>
              <p className="mt-1 sm:mt-3 text-lg sm:text-xl font-semibold text-slate-950">ISO / GMP ready</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2rem] border border-slate-200 bg-slate-950/95 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.16)] sm:p-10">
          <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(30,194,185,0.16),transparent_40%)]" />
          <div className="relative space-y-5 text-white">
            <div className="space-y-4">
              <div className="text-xs sm:text-sm uppercase tracking-[0.32em] text-teal-200">Lab transformation</div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em]">Turnkey labs. Unmatched precision.</h2>
              <p className="max-w-xl text-sm leading-7 text-slate-200">
                Tailored lab systems, automation and analytics for chemistry, pharma, oil & gas and academic facilities.
              </p>
            </div>
            <div className="grid gap-4 rounded-[1.75rem] bg-slate-900/80 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.32)]">
              <div className="rounded-3xl bg-brand-900/90 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-teal-200">Today’s advantage</p>
                <p className="mt-3 text-lg font-semibold">Integrated lab automation for real-time workflows.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Automation', 'Analytics', 'Commissioning', 'Support'].map(item => (
                  <div key={item} className="rounded-3xl bg-slate-950/90 p-4 text-sm text-slate-200">
                    <p className="font-semibold">{item}</p>
                    <p className="mt-2 text-slate-400">Designed for enterprise-grade scientific operations.</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Lab design', 'Smart data', 'Precision analytics', 'Custom systems'].map(label => (
                <div key={label} className="rounded-3xl border border-slate-700 bg-slate-900/80 p-4 text-sm text-slate-200">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
