import { defineConfig, devices } from '@playwright/test'

// Sets DATABASE_URL to the test database (throws if TEST_DATABASE_URL is missing)
import './tests/helpers/testEnv'

const PORT = 3100
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    // Admin tests seed a user, so they run once, in one browser
    {
      name: 'admin',
      testMatch: /admin\..*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Public site tests run across browsers and a phone viewport
    {
      name: 'chromium',
      testIgnore: /admin\..*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: /admin\..*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: /admin\..*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile',
      testIgnore: /admin\..*\.spec\.ts/,
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    // CI tests the production build; locally the dev server is faster to iterate on.
    // The server inherits DATABASE_URL from this process, i.e. the test database.
    command: process.env.CI
      ? `npm run build && npm run start -- --port ${PORT}`
      : `npm run dev -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
