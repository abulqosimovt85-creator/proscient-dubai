import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../services/siteApi'
import type { Product } from '../types'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    fetchProductById(id).then(setProduct)
  }, [id])

  if (!product) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:px-8 lg:px-12">
        <p className="text-2xl font-semibold text-slate-900">Product not found</p>
        <Link to="/products" className="mt-6 inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800">
          Back to catalog
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">{product.category}</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">{product.name}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">{product.application}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700 shrink-0">
            <span className="font-semibold text-slate-900">Brand</span>
            <span>{product.brand}</span>
          </div>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_0.6fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] bg-brand-700/10 p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-brand-900">Overview</p>
              <p className="mt-4 text-lg font-semibold text-slate-950">Designed for high-performance lab environments.</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{product.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{key}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Applications</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{product.application}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Resources</p>
              <a href={product.pdf} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800">
                Download specification
              </a>
            </div>
            <Link to="/contact" className="inline-flex w-full items-center justify-center rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-800">
              Request quote
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
