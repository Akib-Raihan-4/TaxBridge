import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

const styles = {
  primary:
    'inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-paper transition-colors duration-200 hover:bg-ink-hover active:bg-ink-hover',
  outline:
    'inline-flex min-h-11 items-center justify-center rounded-full border border-ink px-6 text-[0.9375rem] font-medium text-ink transition-colors duration-200 hover:bg-ink hover:text-paper',
  text: 'group inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-ink underline-offset-4 hover:underline',
} as const

type Props = {
  href: string
  children: ReactNode
  variant?: keyof typeof styles
  className?: string
}

/** Link styled as a button. Uses a plain <a> for tel:, mailto: and external links. */
export function ButtonLink({ href, children, variant = 'primary', className = '' }: Props) {
  const content = (
    <>
      {children}
      {variant === 'text' && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
    </>
  )
  const classes = `${styles[variant]} ${className}`

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  )
}
