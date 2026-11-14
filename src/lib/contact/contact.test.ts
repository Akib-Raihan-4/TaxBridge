import { afterEach, describe, expect, it, vi } from 'vitest'

import { enquirySchema, validateField } from './schema'
import { enquiryEmailText, sendEnquiryEmail, verifyTurnstile } from './services'
import { HONEYPOT_FIELD, submitEnquiry, type SubmitDeps } from './submit'

const valid = {
  name: 'Alex Citizen',
  email: 'alex@example.com',
  phone: '0400 000 000',
  service: 'Individual tax returns',
  message: 'I need help with my tax return this year.',
}

const form = (fields: Record<string, string>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}

const deps = (overrides: Partial<SubmitDeps> = {}) => ({
  verifyHuman: vi.fn(async () => true),
  save: vi.fn(async () => {}),
  notify: vi.fn(async () => {}),
  logError: vi.fn(),
  ...overrides,
})

describe('enquirySchema', () => {
  it('accepts a complete enquiry and trims whitespace', () => {
    const result = enquirySchema.parse({ ...valid, name: '  Alex Citizen  ' })
    expect(result.name).toBe('Alex Citizen')
  })

  it('allows phone and service to be blank', () => {
    expect(enquirySchema.safeParse({ ...valid, phone: '', service: '' }).success).toBe(true)
  })

  it.each([
    ['name', '', 'Enter your name'],
    ['email', '', 'Enter your email address'],
    ['email', 'not-an-email', 'Enter a valid email address'],
    ['phone', 'abc', 'Enter a valid phone number'],
    ['message', 'Hi', 'Write at least 10 characters'],
  ] as const)('rejects %s = "%s" with a helpful message', (field, value, message) => {
    expect(validateField(field, value)).toBe(message)
  })

  it('rejects an over-long message', () => {
    expect(validateField('message', 'x'.repeat(3001))).toMatch(/too long/)
  })
})

describe('submitEnquiry', () => {
  it('saves a valid enquiry and notifies the firm', async () => {
    const d = deps()
    const result = await submitEnquiry(form(valid), d)

    expect(result).toEqual({ status: 'success' })
    expect(d.save).toHaveBeenCalledWith(valid)
    expect(d.notify).toHaveBeenCalledWith(valid)
  })

  it('returns field errors and the entered values, and stores nothing, when invalid', async () => {
    const d = deps()
    const result = await submitEnquiry(form({ ...valid, email: 'nope', message: 'short' }), d)

    expect(result.status).toBe('invalid')
    if (result.status !== 'invalid') return
    expect(Object.keys(result.errors)).toEqual(['email', 'message'])
    expect(result.values.name).toBe('Alex Citizen')
    expect(d.save).not.toHaveBeenCalled()
    expect(d.verifyHuman).not.toHaveBeenCalled()
  })

  it('pretends to succeed but stores nothing when the hidden spam field is filled', async () => {
    const d = deps()
    const result = await submitEnquiry(
      form({ ...valid, [HONEYPOT_FIELD]: 'http://spam.example' }),
      d,
    )

    expect(result).toEqual({ status: 'success' })
    expect(d.save).not.toHaveBeenCalled()
    expect(d.notify).not.toHaveBeenCalled()
  })

  it('rejects the submission when the spam check fails or errors', async () => {
    for (const verifyHuman of [
      vi.fn(async () => false),
      vi.fn(async () => Promise.reject(new Error('down'))),
    ]) {
      const d = deps({ verifyHuman })
      const result = await submitEnquiry(form(valid), d)
      expect(result.status).toBe('error')
      expect(d.save).not.toHaveBeenCalled()
    }
  })

  it('passes the Turnstile token to the spam check', async () => {
    const d = deps()
    await submitEnquiry(form({ ...valid, 'cf-turnstile-response': 'token-123' }), d)
    expect(d.verifyHuman).toHaveBeenCalledWith('token-123')
  })

  it('tells the visitor and keeps their input when saving fails', async () => {
    const d = deps({ save: vi.fn(async () => Promise.reject(new Error('db down'))) })
    const result = await submitEnquiry(form(valid), d)

    expect(result.status).toBe('error')
    if (result.status !== 'error') return
    expect(result.values).toEqual(valid)
    expect(d.notify).not.toHaveBeenCalled()
    expect(d.logError).toHaveBeenCalled()
  })

  it('still succeeds when the email fails, because the enquiry is already saved', async () => {
    const d = deps({ notify: vi.fn(async () => Promise.reject(new Error('email down'))) })
    const result = await submitEnquiry(form(valid), d)

    expect(result).toEqual({ status: 'success' })
    expect(d.save).toHaveBeenCalled()
    expect(d.logError).toHaveBeenCalled()
  })
})

describe('email and spam-check services', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('formats the enquiry as a plain-text email', () => {
    const text = enquiryEmailText({ ...valid, phone: '' })
    expect(text).toContain('Name:    Alex Citizen')
    expect(text).toContain('Phone:   —')
    expect(text).toContain('I need help with my tax return this year.')
  })

  it('sends nothing when email is not configured', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('CONTACT_TO_EMAIL', '')

    await sendEnquiryEmail(valid)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sends through Resend with the visitor as reply-to, and throws on failure', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('CONTACT_TO_EMAIL', 'office@example.com')

    await sendEnquiryEmail(valid)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    const body = JSON.parse(init.body as string)
    expect(url).toBe('https://api.resend.com/emails')
    expect(body.to).toEqual(['office@example.com'])
    expect(body.reply_to).toBe('alex@example.com')
    expect(body.subject).toBe('New enquiry from Alex Citizen')

    fetchMock.mockResolvedValueOnce(new Response('bad key', { status: 401 }))
    await expect(sendEnquiryEmail(valid)).rejects.toThrow(/401/)
  })

  it('skips the spam check when no secret is configured', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    expect(await verifyTurnstile('')).toBe(true)
  })

  it('requires a valid token when a secret is configured', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret')
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true })))
    vi.stubGlobal('fetch', fetchMock)

    expect(await verifyTurnstile('')).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(await verifyTurnstile('good-token')).toBe(true)

    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: false })))
    expect(await verifyTurnstile('bad-token')).toBe(false)
  })
})
