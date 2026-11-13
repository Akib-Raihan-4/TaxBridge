/** Run with `npm run seed`. Uses DATABASE_URL from .env.local. */
import config from '@payload-config'
import { getPayload } from 'payload'

import { seed } from './seed'

const payload = await getPayload({ config })
const result = await seed(payload)
payload.logger.info(`Seed finished: ${result.created} created, ${result.skipped} already present.`)
process.exit(0)
