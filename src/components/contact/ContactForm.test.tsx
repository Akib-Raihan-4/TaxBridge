import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { ContactFormState } from '@/lib/contact/schema'

import { ContactForm } from './ContactForm'

const services = ['Individual tax returns', 'BAS and GST']
const setup = (action = vi.fn(async (): Promise<ContactFormState> => ({ status: 'success' }))) => {
  render(<ContactForm action={action} services={services} />)
  return { action, user: userEvent.setup() }
}

describe('ContactForm', () => {
  it('has a visible label for every field and lists the services', () => {
    setup()
    expect(screen.getByLabelText('Your name')).toBeRequired()
    expect(screen.getByLabelText('Email address')).toBeRequired()
    expect(screen.getByLabelText(/Phone/)).not.toBeRequired()
    expect(screen.getByLabelText('Your message')).toBeRequired()
    expect(screen.getByRole('option', { name: 'BAS and GST' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/privacy')
  })

  it('shows an inline error when a field is left with an invalid value, and clears it once fixed', async () => {
    const { user } = setup()
    const email = screen.getByLabelText('Email address')

    await user.type(email, 'not-an-email')
    await user.tab()
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription(/Enter a valid email address/)

    await user.clear(email)
    await user.type(email, 'alex@example.com')
    await user.tab()
    expect(email).not.toHaveAttribute('aria-invalid')
  })

  it('does not complain about an empty field the visitor only tabbed through', async () => {
    const { user } = setup()
    await user.click(screen.getByLabelText('Your name'))
    await user.tab()
    expect(screen.getByLabelText('Your name')).not.toHaveAttribute('aria-invalid')
  })

  it('shows server errors, keeps what was typed and focuses the first problem', async () => {
    const action = vi.fn(async (): Promise<ContactFormState> => ({
      status: 'invalid',
      errors: { email: 'Enter a valid email address' },
      values: {
        name: 'Alex',
        email: 'nope',
        phone: '',
        service: '',
        message: 'A long enough message',
      },
    }))
    const { user } = setup(action)

    await user.click(screen.getByRole('button', { name: 'Send message' }))

    await waitFor(() => expect(screen.getByLabelText('Email address')).toHaveFocus())
    expect(screen.getByLabelText('Your name')).toHaveValue('Alex')
    expect(screen.getByLabelText('Your message')).toHaveValue('A long enough message')
    expect(screen.getByLabelText('Email address')).toHaveAccessibleDescription(
      /Enter a valid email/,
    )
  })

  it('shows a general error as an alert and keeps the form', async () => {
    const action = vi.fn(async (): Promise<ContactFormState> => ({
      status: 'error',
      message: 'Sorry, something went wrong.',
      values: {
        name: 'Alex',
        email: 'alex@example.com',
        phone: '',
        service: '',
        message: 'A long enough message',
      },
    }))
    const { user } = setup(action)

    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Sorry, something went wrong.')
    expect(screen.getByLabelText('Your name')).toHaveValue('Alex')
  })

  it('replaces the form with a confirmation after a successful send', async () => {
    const { user, action } = setup()
    await user.type(screen.getByLabelText('Your name'), 'Alex Citizen')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByRole('status')).toHaveTextContent(/your message is on its way/)
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument()
    expect(action).toHaveBeenCalledOnce()
  })

  it('hides the spam-trap field from keyboard and assistive technology', () => {
    const { container } = render(<ContactForm action={vi.fn()} services={[]} />)
    const trap = container.querySelector('input[name="website"]')
    expect(trap).toHaveAttribute('tabindex', '-1')
    expect(trap?.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
