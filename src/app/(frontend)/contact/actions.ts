'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

import type { ContactFormState } from '@/lib/contact/schema'
import { sendEnquiryEmail, verifyTurnstile } from '@/lib/contact/services'
import { submitEnquiry } from '@/lib/contact/submit'

/** Server action behind the contact form. */
export async function sendEnquiry(
  _previous: ContactFormState,
  form: FormData,
): Promise<ContactFormState> {
  const payload = await getPayload({ config })

  return submitEnquiry(form, {
    verifyHuman: verifyTurnstile,
    save: async (enquiry) => {
      // Trusted server-side write: the public has no API access to this collection
      await payload.create({
        collection: 'enquiries',
        data: {
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone || undefined,
          service: enquiry.service || undefined,
          message: enquiry.message,
          status: 'new',
        },
      })
    },
    notify: sendEnquiryEmail,
    logError: (message, error) => payload.logger.error({ err: error }, message),
  })
}
