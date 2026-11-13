import { describe, expect, it } from 'vitest'

import { formatPrice, phoneHref } from './format'

describe('phoneHref', () => {
  it('converts a landline with area code to international format', () => {
    expect(phoneHref('(02) 9000 0000')).toBe('tel:+61290000000')
  })

  it('converts a mobile number', () => {
    expect(phoneHref('0400 000 000')).toBe('tel:+61400000000')
  })

  it('leaves 1300 and 1800 numbers without a country code', () => {
    expect(phoneHref('1300 000 000')).toBe('tel:1300000000')
    expect(phoneHref('1800 000 000')).toBe('tel:1800000000')
  })

  it('keeps numbers already in international format', () => {
    expect(phoneHref('+61 2 9000 0000')).toBe('tel:+61290000000')
  })
})

describe('formatPrice', () => {
  it('formats whole dollars with a thousands separator', () => {
    expect(formatPrice(129)).toBe('$129')
    expect(formatPrice(1100)).toBe('$1,100')
  })
})
