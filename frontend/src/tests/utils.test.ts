import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
    it('joins plain class strings', () => {
        expect(cn('px-2', 'text-sm')).toBe('px-2 text-sm')
    })

    it('lets the later conflicting Tailwind class win instead of applying both', () => {
        expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('drops falsy values', () => {
        expect(cn('px-2', false, null, undefined, '')).toBe('px-2')
    })

    it('resolves conditional class objects', () => {
        expect(cn('base', { 'text-red-500': true, 'text-blue-500': false })).toBe('base text-red-500')
    })
})
