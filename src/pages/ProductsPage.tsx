import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, products } from '../data/content'
import { fetchProducts } from '../services/siteApi'
import SectionHeading from '../components/SectionHeading'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [items, setItems] = useState(products)

  useEffect(() => {
    fetchProducts(search, activeCategory).then(setItems)
  }, [search, activeCategory])

  const categoryLabel = useMemo(
    () => categories.find(category => category.id === activeCategory)?.name ?? 'All categories',
    [activeCategory],
  )

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <SectionHeading
            eyebrow="Products"
            title="Elevate your lab capabilities"
            description="Search equipment, consumables and chemicals backed by premium service and technical support."
          />
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Search products</label>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100"
              placeholder="Brand, category or application"
            />
          </div>
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-slate-500">Category</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveCategory('')}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeCategory === '' ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All categories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    activeCategory === category.id
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
            Viewing <span className="font-semibold text-slate-900">{items.length}</span> products in <span className="font-semibold text-slate-900">{categoryLabel}</span>
          </div>
        </div>
        <div className="space-y-6">
          {items.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xl font-semibold text-slate-900">No products match your search.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {items.map(product => (
                <article key={product.id} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.32em] text-slate-500">{product.category}</p>
                      <h3 className="mt-3 text-2xl font-semibold text-slate-950">{product.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 shrink-0">{product.brand}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">{product.application}</span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">{product.id.toUpperCase()}</span>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link to={`/products/${product.id}`} className="text-sm font-semibold text-brand-700 hover:text-brand-900">
                      View details →
                    </Link>
                    <Link to="/contact" className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                      Request quote
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
