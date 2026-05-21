import { blogPosts } from '../data/content'
import SectionHeading from '../components/SectionHeading'

export default function InsightsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Insights"
        title="Science news. Market trends. Real results."
        description="Thought leadership and articles focused on lab innovation, analytics and scientific operations in the region."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {blogPosts.map(post => (
          <article key={post.id} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.32em] text-teal-700">{post.date}</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">{post.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-slate-500">
              {post.tags.map(tag => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
