import SectionHeading from '../components/SectionHeading'
import { brands } from '../data/content'
import { useMemo, useState } from 'react'

export default function BrandsPage() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () => brands.filter(item => item.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <SectionHeading
            eyebrow="Brands"
            title="Global partner brands, local delivery"
            description="A curated partner network for lab instrumentation, consumables and chemicals that supports UAE projects and regional supply chains."
          />
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <label className="block text-sm font-medium text-slate-700">Search brands</label>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter partners"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(brand => (
          <div key={brand.id} className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-900 text-xl font-semibold text-white">{brand.name[0]}</div>
            <p className="mt-5 text-xl font-semibold text-slate-950">{brand.logo}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
