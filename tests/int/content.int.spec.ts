import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  queryFaqs,
  queryHomePage,
  queryPostBySlug,
  queryPosts,
  queryServiceBySlug,
  queryServices,
  querySiteSettings,
  queryTestimonials,
} from '@/lib/cms/queries'
import config from '@/payload.config'
import { seed } from '@/seed/seed'

let payload: Payload
const context = { disableRevalidate: true }
const cleanup: (() => Promise<unknown>)[] = []

beforeAll(async () => {
  payload = await getPayload({ config: await config })
})

afterAll(async () => {
  for (const remove of cleanup) await remove()
})

describe('seed', () => {
  it('creates starter content and is safe to run twice', async () => {
    await seed(payload)
    const second = await seed(payload)

    expect(second.created).toBe(0)
    expect((await queryServices()).length).toBeGreaterThanOrEqual(8)
    expect((await queryFaqs()).length).toBeGreaterThanOrEqual(6)
    expect((await querySiteSettings()).businessName).toBe('TaxBridge')
  })

  it('does not seed facts that must come from the business', async () => {
    const pricing = await payload.count({ collection: 'pricing-items' })
    const settings = await querySiteSettings()

    expect(pricing.totalDocs).toBe(0)
    expect(settings.taxAgentNumber ?? null).toBeNull()
    expect(settings.phones ?? []).toHaveLength(0)
    expect(settings.showPslStatement).toBe(false)
  })
})

describe('public content queries', () => {
  it('returns services in order and finds one by slug', async () => {
    const services = await queryServices()
    const orders = services.map((service) => service.order ?? 0)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))

    const service = await queryServiceBySlug('individual-tax-returns')
    expect(service?.title).toBe('Individual tax returns')
    expect(service?.inclusions?.length).toBeGreaterThan(0)

    expect(await queryServiceBySlug('does-not-exist')).toBeNull()
  })

  it('populates featured services on the home page', async () => {
    const home = await queryHomePage()
    expect(home.hero.heading).toBeTruthy()
    expect(home.featuredServices?.length).toBeGreaterThan(0)
    expect(typeof home.featuredServices?.[0]).toBe('object')
  })

  it('rejects a duplicate slug', async () => {
    await expect(
      payload.create({
        collection: 'services',
        context,
        data: {
          title: 'Duplicate',
          slug: 'individual-tax-returns',
          generateSlug: false,
          category: 'individuals',
          summary: 'Test.',
        },
      }),
    ).rejects.toThrow()
  })
})

describe('what the public can see', () => {
  it('hides draft articles and shows published ones', async () => {
    const draft = await payload.create({
      collection: 'posts',
      context,
      draft: true,
      data: { title: 'Test draft article', slug: 'test-draft-article', _status: 'draft' },
    })
    const published = await payload.create({
      collection: 'posts',
      context,
      data: {
        title: 'Test published article',
        slug: 'test-published-article',
        _status: 'published',
      },
    })
    cleanup.push(() => payload.delete({ collection: 'posts', id: draft.id, context }))
    cleanup.push(() => payload.delete({ collection: 'posts', id: published.id, context }))

    const slugs = (await queryPosts()).map((post) => post.slug)
    expect(slugs).toContain('test-published-article')
    expect(slugs).not.toContain('test-draft-article')
    expect(await queryPostBySlug('test-draft-article')).toBeNull()

    // Publishing stamps the date automatically
    expect(published.publishedAt).toBeTruthy()
  })

  it('hides testimonials until they are approved', async () => {
    const pending = await payload.create({
      collection: 'testimonials',
      context,
      data: { quote: 'Pending quote', name: 'Test Pending' },
    })
    const approved = await payload.create({
      collection: 'testimonials',
      context,
      data: { quote: 'Approved quote', name: 'Test Approved', approved: true },
    })
    cleanup.push(() => payload.delete({ collection: 'testimonials', id: pending.id, context }))
    cleanup.push(() => payload.delete({ collection: 'testimonials', id: approved.id, context }))

    const names = (await queryTestimonials()).map((testimonial) => testimonial.name)
    expect(names).toContain('Test Approved')
    expect(names).not.toContain('Test Pending')
  })

  it('never exposes enquiries, and the public cannot submit them through the API', async () => {
    const enquiry = await payload.create({
      collection: 'enquiries',
      data: { name: 'Test Person', email: 'test@example.com', message: 'Hello', status: 'new' },
    })
    cleanup.push(() => payload.delete({ collection: 'enquiries', id: enquiry.id }))

    expect(enquiry.status).toBe('new')
    await expect(payload.find({ collection: 'enquiries', overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.create({
        collection: 'enquiries',
        overrideAccess: false,
        data: { name: 'Spam', email: 'spam@example.com', message: 'Spam', status: 'new' },
      }),
    ).rejects.toThrow()
  })

  it('does not let the public change content', async () => {
    await expect(
      payload.create({
        collection: 'services',
        overrideAccess: false,
        data: { title: 'Hacked', slug: 'hacked', category: 'business', summary: 'x' },
      }),
    ).rejects.toThrow()
    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        overrideAccess: false,
        data: { businessName: 'Hacked' },
      }),
    ).rejects.toThrow()
  })
})

describe('user roles', () => {
  it('lets editors edit content but not manage users or delete enquiries', async () => {
    // Make sure an admin exists so the editor below is not "the first user"
    const admin = await payload.create({
      collection: 'users',
      data: { email: 'roles-admin@example.com', password: 'test-password-1', role: 'admin' },
    })
    const editor = await payload.create({
      collection: 'users',
      data: { email: 'roles-editor@example.com', password: 'test-password-2' },
    })
    cleanup.push(() => payload.delete({ collection: 'users', id: editor.id }))
    cleanup.push(() => payload.delete({ collection: 'users', id: admin.id }))

    expect(editor.role).toBe('editor')
    const asEditor = { user: { ...editor, collection: 'users' as const }, overrideAccess: false }

    // Can edit content
    const faq = await payload.create({
      collection: 'faqs',
      context,
      data: { question: 'Test editor question?', answer: 'Yes.', category: 'general' },
      ...asEditor,
    })
    cleanup.push(() => payload.delete({ collection: 'faqs', id: faq.id, context }))
    expect(faq.id).toBeTruthy()

    // Cannot create users, see other users, or promote themselves
    await expect(
      payload.create({
        collection: 'users',
        data: { email: 'sneaky@example.com', password: 'test-password-3' },
        ...asEditor,
      }),
    ).rejects.toThrow()

    const visibleUsers = await payload.find({ collection: 'users', ...asEditor })
    expect(visibleUsers.docs.map((user) => user.id)).toEqual([editor.id])

    const selfUpdate = await payload.update({
      collection: 'users',
      id: editor.id,
      data: { role: 'admin', name: 'Editor' },
      ...asEditor,
    })
    expect(selfUpdate.role).toBe('editor')
    expect(selfUpdate.name).toBe('Editor')

    // Cannot delete enquiries
    const enquiry = await payload.create({
      collection: 'enquiries',
      data: { name: 'Test Keep', email: 'keep@example.com', message: 'Keep me', status: 'new' },
    })
    cleanup.push(() => payload.delete({ collection: 'enquiries', id: enquiry.id }))
    await expect(
      payload.delete({ collection: 'enquiries', id: enquiry.id, ...asEditor }),
    ).rejects.toThrow()
  })
})
