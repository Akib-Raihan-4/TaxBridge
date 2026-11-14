import {
  emptyEnquiry,
  enquirySchema,
  type ContactFormState,
  type EnquiryErrors,
  type EnquiryInput,
} from './schema'

/** Name of the hidden "honeypot" input. People never see it; bots tend to fill it in. */
export const HONEYPOT_FIELD = 'website'

export type SubmitDeps = {
  /** Check the anti-spam token. Return true when the visitor is verified. */
  verifyHuman: (token: string) => Promise<boolean>
  /** Persist the enquiry. Throwing means the enquiry was NOT received. */
  save: (enquiry: EnquiryInput) => Promise<void>
  /** Notify the firm by email. Failure is logged but does not fail the submission. */
  notify: (enquiry: EnquiryInput) => Promise<void>
  logError?: (message: string, error: unknown) => void
}

const text = (form: FormData, key: string): string => {
  const value = form.get(key)
  return typeof value === 'string' ? value : ''
}

/**
 * Handles one contact form submission. Kept free of framework and network code so
 * it can be tested directly; the server action supplies the real dependencies.
 */
export async function submitEnquiry(form: FormData, deps: SubmitDeps): Promise<ContactFormState> {
  const values: EnquiryInput = {
    name: text(form, 'name'),
    email: text(form, 'email'),
    phone: text(form, 'phone'),
    service: text(form, 'service'),
    message: text(form, 'message'),
  }

  // Bots that fill the hidden field get a normal-looking success and nothing is stored
  if (text(form, HONEYPOT_FIELD).trim() !== '') return { status: 'success' }

  const parsed = enquirySchema.safeParse(values)
  if (!parsed.success) {
    const errors: EnquiryErrors = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof EnquiryInput
      errors[field] ??= issue.message
    }
    return { status: 'invalid', errors, values }
  }

  const human = await deps.verifyHuman(text(form, 'cf-turnstile-response')).catch(() => false)
  if (!human) {
    return {
      status: 'error',
      message: 'We couldn’t confirm you’re not a robot. Complete the check below and send again.',
      values,
    }
  }

  try {
    await deps.save(parsed.data)
  } catch (error) {
    deps.logError?.('Contact form: could not save enquiry', error)
    return {
      status: 'error',
      message: 'Sorry, something went wrong and your message was not sent. Try again in a moment.',
      values,
    }
  }

  // The enquiry is safely stored, so an email problem must not lose it or alarm the visitor
  await deps.notify(parsed.data).catch((error) => {
    deps.logError?.('Contact form: enquiry saved but the notification email failed', error)
  })

  return { status: 'success' }
}

export { emptyEnquiry }
