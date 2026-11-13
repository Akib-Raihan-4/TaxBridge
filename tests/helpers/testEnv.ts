/**
 * Points Payload at the TEST database and makes it impossible for tests to reach
 * the real one. Reads TEST_DATABASE_URL from the environment or `.env.test.local`.
 * Imported by the Vitest integration project and by playwright.config.ts.
 */
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test.local' })

const testUrl = process.env.TEST_DATABASE_URL

if (!testUrl) {
  // Make sure nothing falls back to a real database
  delete process.env.DATABASE_URL
  throw new Error(
    'TEST_DATABASE_URL is not set. Add it to .env.test.local — it must be a separate ' +
      'database (a Neon branch or local Postgres), because tests create and delete data.',
  )
}

process.env.DATABASE_URL = testUrl
// Test databases are throwaway: let Payload create the schema directly
process.env.PAYLOAD_DB_PUSH = 'true'
process.env.PAYLOAD_SECRET ||= 'test-secret-not-for-production'
// Never upload test files to Vercel Blob
delete process.env.BLOB_READ_WRITE_TOKEN
