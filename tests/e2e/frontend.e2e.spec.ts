import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/** Public routes. Add every new page here so it gets smoke + accessibility checks. */
const routes = [
  { path: '/', heading: /Tax and accounting you can understand/ },
  { path: '/about', heading: /About us/ },
  { path: '/services', heading: /Accounting and tax services/ },
  { path: '/services/individual-tax-returns', heading: /Individual tax returns/ },
  { path: '/pricing', heading: /Clear fees/ },
  { path: '/resources', heading: /Guides and tax tips/ },
  { path: '/contact', heading: /talk about your tax/ },
  { path: '/privacy', heading: /Privacy policy/ },
  { path: '/terms', heading: /Terms of use/ },
]

for (const route of routes) {
  test.describe(`page ${route.path}`, () => {
    test('loads with a unique title, one h1 and no script errors', async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))

      const response = await page.goto(route.path)

      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(/TaxBridge/)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(route.heading)
      await expect(page.locator('meta[name="description"]')).toHaveCount(
        route.path === '/privacy' || route.path === '/terms' ? 0 : 1,
      )
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
      expect(errors).toEqual([])
    })

    test('has no horizontal scroll', async ({ page }) => {
      await page.goto(route.path)
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      )
      expect(overflows).toBe(false)
    })

    test('has no accessibility violations', async ({ page }) => {
      await page.goto(route.path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  })
}

test('skip link is the first focusable element and targets main', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Safari does not tab to links by default')
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await expect(page.locator('main#main')).toBeVisible()
})

test('unknown routes show the custom 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()

  const missingService = await page.goto('/services/no-such-service')
  expect(missingService?.status()).toBe(404)
})

test('a visitor can get from the home page to a service and on to contact', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Covered by the mobile menu test')
  await page.goto('/')

  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Services' })
    .click()
  await expect(page).toHaveURL(/\/services$/)

  await page.getByRole('link', { name: /Individual tax returns/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Individual tax returns')
  await expect(page.getByRole('heading', { name: 'What is included' })).toBeVisible()

  await page.getByRole('main').getByRole('link', { name: 'Book a consultation' }).first().click()
  await expect(page).toHaveURL(/\/contact$/)
})

test('the mobile menu opens, navigates and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Phone layout only')
  await page.goto('/')

  const toggle = page.getByRole('button', { name: 'Open menu' })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )

  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Pricing' })
    .click()
  await expect(page).toHaveURL(/\/pricing$/)
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
})

test('FAQ answers expand when the question is clicked', async ({ page }) => {
  await page.goto('/contact')
  const answer = page.getByText(/Photo ID, your income statements/)
  await expect(answer).toBeHidden()
  await page.getByText('What should I bring to my tax appointment?').click()
  await expect(answer).toBeVisible()
})

test('robots.txt and sitemap.xml are served', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Disallow: /admin')

  const sitemap = await request.get('/sitemap.xml')
  const xml = await sitemap.text()
  expect(xml).toContain('/services/individual-tax-returns')
  expect(xml).toContain('/contact')
})
