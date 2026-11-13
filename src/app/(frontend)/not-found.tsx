import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-lg text-muted">Sorry, we couldn’t find the page you were looking for.</p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Back to home
      </Link>
    </section>
  )
}
