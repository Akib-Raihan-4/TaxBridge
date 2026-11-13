import { Plus } from 'lucide-react'

type Faq = { id?: string | number | null; question: string; answer: string }

/**
 * Accordion built on native <details>, so it works without JavaScript and is
 * keyboard- and screen-reader-accessible by default.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null

  return (
    <div className="border-t border-line">
      {faqs.map((faq) => (
        <details key={faq.id ?? faq.question} className="group border-b border-line">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 font-serif text-lg text-ink sm:text-xl [&::-webkit-details-marker]:hidden">
            {faq.question}
            <Plus
              aria-hidden="true"
              className="size-5 shrink-0 text-gold transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed whitespace-pre-line text-body">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
