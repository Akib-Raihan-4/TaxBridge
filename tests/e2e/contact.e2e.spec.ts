import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

const stamp = () => `${Date.now()}-${Math.round(Math.random() * 1e6)}`

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('saves a valid enquiry and confirms to the visitor', async ({ page }) => {
    const email = `e2e-${stamp()}@example.com`

    await page.getByLabel('Your name').fill('E2E Test Person')
    await page.getByLabel('Email address').fill(email)
    await page.getByLabel(/Phone/).fill('0400 000 000')
    await page.getByLabel(/What do you need help with/).selectOption('BAS and GST')
    await page.getByLabel('Your message').fill('This is an automated test enquiry.')
    await page.getByRole('button', { name: 'Send message' }).click()

    const confirmation = page.getByRole('status')
    await expect(confirmation).toContainText('your message is on its way')
    await expect(confirmation).toBeFocused()
    await expect(page.getByRole('button', { name: 'Send message' })).toHaveCount(0)

    // It really reached the database, as a new enquiry
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'enquiries',
      where: { email: { equals: email } },
    })
    expect(docs).toHaveLength(1)
    expect(docs[0]).toMatchObject({
      name: 'E2E Test Person',
      phone: '0400 000 000',
      service: 'BAS and GST',
      message: 'This is an automated test enquiry.',
      status: 'new',
    })
    await payload.delete({ collection: 'enquiries', id: docs[0].id })
  })

  test('shows errors next to the fields, keeps input, and stays accessible', async ({ page }) => {
    await page.getByLabel('Your name').fill('E2E Test Person')
    await page.getByLabel('Email address').fill('not-an-email')
    await page.getByRole('button', { name: 'Send message' }).click()

    const email = page.getByLabel('Email address')
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toBeFocused()
    await expect(page.getByText('Enter a valid email address', { exact: true })).toBeVisible()
    await expect(page.getByText('Write at least 10 characters')).toBeVisible()
    await expect(page.getByLabel('Your name')).toHaveValue('E2E Test Person')
    await expect(page.getByRole('status')).toHaveCount(0)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])

    // Fixing the problems lets it through
    const fixedEmail = `e2e-${stamp()}@example.com`
    await email.fill(fixedEmail)
    await page.getByLabel('Your message').fill('Now with a proper message.')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByRole('status')).toContainText('your message is on its way')

    // Clean up only this test's row — other browsers run the same tests in parallel
    const payload = await getPayload({ config })
    await payload.delete({ collection: 'enquiries', where: { email: { equals: fixedEmail } } })
  })

  test('silently drops submissions that fill the hidden spam field', async ({ page }) => {
    const email = `e2e-bot-${stamp()}@example.com`
    await page.getByLabel('Your name').fill('E2E Bot')
    await page.getByLabel('Email address').fill(email)
    await page.getByLabel('Your message').fill('Buy cheap things at my website.')
    await page.locator('input[name="website"]').evaluate((input: HTMLInputElement) => {
      input.value = 'http://spam.example'
    })
    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(page.getByRole('status')).toContainText('your message is on its way')
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({
      collection: 'enquiries',
      where: { email: { equals: email } },
    })
    expect(totalDocs).toBe(0)
  })

  test('does not load the real spam-check or email services during tests', async ({ page }) => {
    await expect(page.locator('script[src*="challenges.cloudflare.com"]')).toHaveCount(0)
    await expect(page.locator('iframe')).toHaveCount(0)
  })
})
