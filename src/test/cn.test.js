import { describe, it, expect } from 'vitest'
import { cn } from '../lib/utils'

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    const result = cn('px-4 py-2', 'px-6')
    expect(result).toBe('py-2 px-6')
  })

  it('handles conditional classes', () => {
    const falsy = false
    const result = cn('base', falsy && 'hidden', 'visible')
    expect(result).toBe('base visible')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })
})
