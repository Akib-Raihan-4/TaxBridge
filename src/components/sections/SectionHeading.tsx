export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
}: {
  eyebrow?: string
  title: string
  intro?: string | null
  id?: string
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="mb-3 text-sm font-medium tracking-wide text-gold">{eyebrow}</p>}
      <h2 id={id} className="text-3xl leading-tight font-normal tracking-tight sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  )
}
