// The `.js` extension lets plain Node (Playwright helpers, scripts) load this file too
import { revalidateTag } from 'next/cache.js'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Expire cached readers (src/lib/cms) for a tag so the static site picks up edits.
 * Outside a Next.js request (seed script, tests) there is no cache to expire, so
 * the call is skipped. Pass `context: { disableRevalidate: true }` to opt out.
 */
function expire(tag: string): void {
  try {
    revalidateTag(tag, 'max')
  } catch {
    // Not running inside Next.js — nothing to revalidate
  }
}

export const revalidateCollection = (
  tag: string,
): { afterChange: CollectionAfterChangeHook[]; afterDelete: CollectionAfterDeleteHook[] } => ({
  afterChange: [
    ({ doc, req }) => {
      if (!req.context.disableRevalidate) expire(tag)
      return doc
    },
  ],
  afterDelete: [
    ({ doc, req }) => {
      if (!req.context.disableRevalidate) expire(tag)
      return doc
    },
  ],
})

export const revalidateGlobal = (tag: string): { afterChange: GlobalAfterChangeHook[] } => ({
  afterChange: [
    ({ doc, req }) => {
      if (!req.context.disableRevalidate) expire(tag)
      return doc
    },
  ],
})
