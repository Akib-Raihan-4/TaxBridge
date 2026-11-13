import { Star } from 'lucide-react'

import type { Testimonial } from '@/payload-types'

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <li key={testimonial.id}>
          <figure className="flex h-full flex-col rounded-2xl border border-line bg-card p-6">
            {testimonial.rating ? (
              <div
                className="flex gap-0.5 text-gold"
                role="img"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: testimonial.rating }, (_, index) => (
                  <Star key={index} aria-hidden="true" className="size-4 fill-current" />
                ))}
              </div>
            ) : null}
            <blockquote className="mt-4 flex-1 font-serif text-lg leading-relaxed text-ink">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-5 text-[0.9375rem] text-muted">
              <span className="font-medium text-ink">{testimonial.name}</span>
              {testimonial.role && <span> · {testimonial.role}</span>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
