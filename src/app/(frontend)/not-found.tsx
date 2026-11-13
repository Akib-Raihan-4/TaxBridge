import { PageHeader } from '@/components/sections/PageHeader'
import { ButtonLink } from '@/components/ui/ButtonLink'

export default function NotFound() {
  return (
    <PageHeader
      eyebrow="Error 404"
      title="Page not found"
      intro="Sorry, we couldn’t find the page you were looking for. It may have moved."
    >
      <ButtonLink href="/">Back to home</ButtonLink>
      <ButtonLink href="/services" variant="text">
        See our services
      </ButtonLink>
    </PageHeader>
  )
}
