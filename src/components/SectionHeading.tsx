type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{eyebrow}</p> : null}
      <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-sm leading-7 text-slate-600">{description}</p> : null}
    </div>
  )
}
