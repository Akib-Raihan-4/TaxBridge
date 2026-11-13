import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

describe('Payload API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterAll(async () => {
    await payload.db.destroy?.()
  })

  it('connects to the database and can query users', async () => {
    const users = await payload.find({ collection: 'users' })
    expect(users.docs).toBeInstanceOf(Array)
  })

  it('does not let anonymous visitors read users', async () => {
    await expect(payload.find({ collection: 'users', overrideAccess: false })).rejects.toThrow()
  })

  it('lets anonymous visitors read media', async () => {
    const media = await payload.find({ collection: 'media', overrideAccess: false })
    expect(media.docs).toBeInstanceOf(Array)
  })
})
