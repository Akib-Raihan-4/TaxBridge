import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/sections/PageHeader'
import { hasRichText, RichText } from '@/components/sections/RichText'
import { Container } from '@/components/ui/Container'
import { getLegalPageBySlug } from '@/lib/cms'

export async function LegalPage({ slug }: { slug: string }) {
  const page = await getLegalPageBySlug(slug)
  if (!page) notFound()

  return (
    <>
      <PageHeader title={page.title} />
      <Container className="py-14 sm:py-16">
        {hasRichText(page.body) ? (
          <RichText data={page.body} />
        ) : (
          <p className="text-lg text-muted">
            This page is being prepared and will be published shortly.
          </p>
        )}
      </Container>
    </>
  )
}
