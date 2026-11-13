import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CtaBand } from '@/components/sections/CtaBand'
import { RichText } from '@/components/sections/RichText'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { getPostBySlug, getPosts, getSiteSettings } from '@/lib/cms'
import { formatDate } from '@/lib/format'
import { buildMetadata } from '@/lib/seo'
import { siteUrl } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return buildMetadata({
    seo: post.seo,
    title: post.title,
    description: post.excerpt,
    path: `/resources/${post.slug}`,
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()])
  if (!post) notFound()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          datePublished: post.publishedAt ?? undefined,
          dateModified: post.updatedAt,
          author: { '@type': 'Organization', name: settings.businessName },
          mainEntityOfPage: `${siteUrl}/resources/${post.slug}`,
        }}
      />

      <article>
        <Container className="max-w-3xl py-14 sm:py-20">
          <ButtonLink href="/resources" variant="text" className="mb-6">
            All resources
          </ButtonLink>
          <h1 className="text-4xl leading-[1.1] font-normal tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          {post.publishedAt && (
            <p className="mt-4 text-muted">
              Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </p>
          )}
          {post.excerpt && (
            <p className="mt-6 text-xl leading-relaxed text-muted">{post.excerpt}</p>
          )}

          <div className="mt-10">
            <RichText data={post.body} />
          </div>

          <p className="mt-12 border-t border-line pt-6 text-sm leading-relaxed text-muted">
            This article is general information only and does not take your personal circumstances
            into account. It is not tax advice. Contact us to talk about your situation.
          </p>
        </Container>
      </article>

      <CtaBand phone={settings.phones?.[0]?.number} />
    </>
  )
}
