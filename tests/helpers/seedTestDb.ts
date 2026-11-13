/**
 * Seeds the TEST database with starter content before the browser tests run, so
 * pages have something to render. `./testEnv` must be imported first: it points
 * DATABASE_URL at the test database (and throws if none is configured).
 */
import './testEnv'

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { seed } from '../../src/seed/seed'

const payload = await getPayload({ config })
const result = await seed(payload)
payload.logger.info(`Test database seeded: ${result.created} created, ${result.skipped} present.`)
process.exit(0)
