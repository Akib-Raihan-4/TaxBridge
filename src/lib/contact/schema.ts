import { z } from 'zod'

/**
 * Validation shared by the browser (on blur) and the server action.
 * Keep messages short: each must fit on one line under its field on a small phone.
 */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100, 'Name is too long'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address')
    .max(200, 'Email address is too long')
    .pipe(z.email('Enter a valid email address')),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number is too long')
    .refine(
      (value) => value === '' || /^[+()\d\s-]{8,}$/.test(value),
      'Enter a valid phone number',
    ),
  service: z.string().trim().max(120),
  message: z
    .string()
    .trim()
    .min(10, 'Write at least 10 characters')
    .max(3000, 'Message is too long (3,000 max)'),
})

export type EnquiryInput = z.infer<typeof enquirySchema>
export type EnquiryField = keyof EnquiryInput
export type EnquiryErrors = Partial<Record<EnquiryField, string>>

export const emptyEnquiry: EnquiryInput = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

/** Validate one field; returns the error message or null. */
export function validateField(field: EnquiryField, value: string): string | null {
  const result = enquirySchema.shape[field].safeParse(value)
  return result.success ? null : (result.error.issues[0]?.message ?? 'Check this field')
}

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'invalid'; errors: EnquiryErrors; values: EnquiryInput }
  | { status: 'error'; message: string; values: EnquiryInput }
