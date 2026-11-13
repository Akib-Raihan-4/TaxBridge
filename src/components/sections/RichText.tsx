import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { ComponentProps } from 'react'

type Data = ComponentProps<typeof LexicalRichText>['data']

/** Renders CMS rich text with the site's long-form typography. */
export function RichText({ data }: { data?: unknown }) {
  if (!data) return null
  return <LexicalRichText data={data as Data} className="prose" />
}

/** True when a rich-text field has any content. */
export function hasRichText(data: unknown): boolean {
  const root = (data as { root?: { children?: { children?: unknown[] }[] } } | null | undefined)
    ?.root
  return Boolean(root?.children?.some((node) => (node.children?.length ?? 0) > 0))
}
