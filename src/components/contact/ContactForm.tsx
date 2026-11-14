'use client'

import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'

import {
  emptyEnquiry,
  validateField,
  type ContactFormState,
  type EnquiryErrors,
  type EnquiryField,
} from '@/lib/contact/schema'
import { HONEYPOT_FIELD } from '@/lib/contact/submit'

import { Turnstile } from './Turnstile'

type Action = (state: ContactFormState, form: FormData) => Promise<ContactFormState>

type Props = {
  action: Action
  services: string[]
  turnstileSiteKey?: string
}

const inputClass =
  'mt-2 block w-full rounded-lg border border-muted/50 bg-card px-4 py-3 text-base text-ink transition-colors placeholder:text-muted/70 hover:border-ink focus:border-ink aria-[invalid=true]:border-error'
const labelClass = 'block text-[0.9375rem] font-medium text-ink'

/**
 * Error text under a field. The slot always takes up one line, so an error appearing
 * or clearing never moves the rest of the form — otherwise the layout shifts as the
 * visitor leaves a field and their click on "Send message" can miss the button.
 */
function FieldError({ field, message }: { field: EnquiryField; message?: string }) {
  return (
    <div className="mt-1.5 mb-2 min-h-6">
      {message && (
        <p
          id={`contact-${field}-error`}
          className="flex items-start gap-1.5 text-[0.9375rem] leading-6 text-error"
        >
          <CircleAlert aria-hidden="true" className="mt-1 size-4 shrink-0" />
          {message}
        </p>
      )}
    </div>
  )
}

export function ContactForm({ action, services, turnstileSiteKey }: Props) {
  // `attempt` counts server responses; it re-keys the fields so they pick up returned values
  const [{ state, attempt }, formAction, pending] = useActionState(
    async (previous: { state: ContactFormState; attempt: number }, form: FormData) => ({
      state: await action(previous.state, form),
      attempt: previous.attempt + 1,
    }),
    { state: { status: 'idle' } as ContactFormState, attempt: 0 },
  )
  const successRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // After each server response, move focus to the outcome so it is seen and announced
  useEffect(() => {
    if (state.status === 'success') successRef.current?.focus()
    if (state.status === 'error') errorRef.current?.focus()
    if (state.status === 'invalid') {
      const first = Object.keys(state.errors)[0]
      if (first) document.getElementById(`contact-${first}`)?.focus()
    }
  }, [state])

  if (state.status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-line bg-card p-8 outline-none sm:p-10"
      >
        <CircleCheck aria-hidden="true" className="size-9 text-success" strokeWidth={1.5} />
        <h3 className="mt-4 text-2xl font-medium">Thanks — your message is on its way</h3>
        <p className="mt-3 max-w-prose leading-relaxed text-body">
          We have received your enquiry and will get back to you as soon as we can, usually within
          one business day.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      {state.status === 'error' && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="flex gap-3 rounded-lg border border-error bg-error-soft p-4 text-error outline-none"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <Fields key={attempt} state={state} services={services} />

      {/* Spam trap: hidden from people and assistive technology; bots tend to fill it in */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} resetKey={attempt} />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-8 font-medium text-paper transition-colors duration-200 hover:bg-ink-hover disabled:cursor-progress disabled:opacity-80"
        >
          {pending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
          {pending ? 'Sending…' : 'Send message'}
        </button>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          We only use your details to reply to you. See our{' '}
          <Link href="/privacy" className="text-ink underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  )
}

/** The visible inputs. Re-created after every server response (see `key` above). */
function Fields({ state, services }: { state: ContactFormState; services: string[] }) {
  const [blurErrors, setBlurErrors] = useState<EnquiryErrors>({})

  const values =
    state.status === 'invalid' || state.status === 'error' ? state.values : emptyEnquiry
  const serverErrors: EnquiryErrors = state.status === 'invalid' ? state.errors : {}
  const errors: EnquiryErrors = { ...serverErrors, ...blurErrors }

  const fieldProps = (field: EnquiryField) => ({
    id: `contact-${field}`,
    name: field,
    defaultValue: values[field],
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
    onBlur: (
      event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      const value = event.target.value
      // Don't nag about a required field the visitor has only tabbed through
      const message =
        value.trim() === '' && !serverErrors[field] ? null : validateField(field, value)
      setBlurErrors((current) => ({ ...current, [field]: message ?? undefined }))
    },
    // Once a field is flagged, clear the error as soon as the value becomes valid
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      if (!errors[field]) return
      const message = validateField(field, event.target.value)
      if (!message) setBlurErrors((current) => ({ ...current, [field]: undefined }))
    },
  })

  return (
    <div>
      <div className="grid gap-x-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Your name
          </label>
          <input
            type="text"
            autoComplete="name"
            required
            className={inputClass}
            {...fieldProps('name')}
          />
          <FieldError field="name" message={errors.name} />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email address
          </label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            className={inputClass}
            {...fieldProps('email')}
          />
          <FieldError field="email" message={errors.email} />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={inputClass}
            {...fieldProps('phone')}
          />
          <FieldError field="phone" message={errors.phone} />
        </div>
        <div>
          <label htmlFor="contact-service" className={labelClass}>
            What do you need help with? <span className="font-normal text-muted">(optional)</span>
          </label>
          <select className={inputClass} {...fieldProps('service')}>
            <option value="">Not sure yet</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <div className="mt-1.5 mb-2 min-h-6" />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Your message
        </label>
        <textarea
          rows={6}
          required
          maxLength={3000}
          className={`${inputClass} resize-y`}
          {...fieldProps('message')}
        />
        <FieldError field="message" message={errors.message} />
      </div>
    </div>
  )
}
