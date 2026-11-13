import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/** Public routes. Add every new page here so it gets smoke + accessibility checks. */
const routes = ['/']

for (const route of routes) {
  test.describe(`page ${route}`, () => {
    test('loads with a title and exactly one h1', async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))

      const response = await page.goto(route)

      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(/.+/)
      await expect(page.locator('h1')).toHaveCount(1)
      expect(errors).toEqual([])
    })

    test('has no horizontal scroll', async ({ page }) => {
      await page.goto(route)
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      )
      expect(overflows).toBe(false)
    })

    test('has no accessibility violations', async ({ page }) => {
      await page.goto(route)
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
  const skipLink = page.getByRole('link', { name: 'Skip to content' })
  await expect(skipLink).toBeFocused()
  await expect(page.locator('main#main')).toBeVisible()
})

test('unknown routes show the custom 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
})
