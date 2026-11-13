import { notFound } from 'next/navigation'

/**
 * The app has two root layouts (site and admin), so unmatched URLs would otherwise
 * get Next's bare default 404. This catch-all sends them to the site's not-found page.
 */
export default function CatchAllNotFound() {
  notFound()
}
