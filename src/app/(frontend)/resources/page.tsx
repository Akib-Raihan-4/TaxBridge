import type { Metadata } from 'next'
import Link from 'next/link'

import { CtaBand } from '@/components/sections/CtaBand'
import { PageHeader } from '@/components/sections/PageHeader'
import { Container } from '@/components/ui/Container'
import { getPosts, getSiteSettings } from '@/lib/cms'
import { formatDate } from '@/lib/format'
import { buildMetadata } from '@/lib/seo'

const description = 'Plain-English guides to tax time, key dates and running a small business.'

export const metadata: Metadata = buildMetadata({
  title: 'Resources',
  description,
  path: '/resources',
})

export default async function ResourcesPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSiteSettings()])

  return (
    <>
      <PageHeader eyebrow="Resources" title="Guides and tax tips" intro={description} />

      <section>
        <Container className="max-w-4xl py-16 sm:py-20">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-line bg-card p-8 sm:p-10">
              <h2 className="text-2xl font-medium">Articles are on the way</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">
                We are putting together guides on tax time, deductions and key dates. In the
                meantime, get in touch with any question.
              </p>
            </div>
          ) : (
            <ul className="border-t border-line">
              {posts.map((post) => (
                <li key={post.id} className="border-b border-line">
                  <Link href={`/resources/${post.slug}`} className="group block py-7">
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt} className="text-sm text-muted">
                        {formatDate(post.publishedAt)}
                      </time>
                    )}
                    <h2 className="mt-1 text-2xl font-medium underline-offset-4 group-hover:underline">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 max-w-2xl leading-relaxed text-muted">{post.excerpt}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <CtaBand phone={settings.phones?.[0]?.number} />
    </>
  )
}
