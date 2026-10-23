import { describe, it, expect } from 'vitest'
import {
    detectCardBrand,
    formatCardNumber,
    formatExpiry,
    passesLuhn,
    validateCardForm,
    validateCardNumber,
    validateCardholderName,
    validateCvc,
    validateExpiry,
} from '@/utils/card-validation'

const NOW = new Date(2026, 9, 23) // 23 Oct 2026

describe('detectCardBrand', () => {
    it.each([
        ['4242 4242 4242 4242', 'visa'],
        ['5555 5555 5555 4444', 'mastercard'],
        ['2223 0031 2200 3222', 'mastercard'],
        ['3782 822463 10005', 'amex'],
        ['5078 0300 0000 0000', 'meeza'],
        ['6011 1111 1111 1117', 'unknown'],
    ])('%s → %s', (number, brand) => {
        expect(detectCardBrand(number)).toBe(brand)
    })
})

describe('formatting', () => {
    it('groups card digits like the card', () => {
        expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242')
        expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005')
    })

    it('drops non-digits and extra digits', () => {
        expect(formatCardNumber('4242-4242-4242-4242-9999-9')).toBe('4242 4242 4242 4242 999')
        expect(formatCardNumber('5555 5555 5555 44449')).toBe('5555 5555 5555 4444')
    })

    it('formats the expiry as MM / YY', () => {
        expect(formatExpiry('1')).toBe('1')
        expect(formatExpiry('4')).toBe('04 / ')
        expect(formatExpiry('12')).toBe('12 / ')
        expect(formatExpiry('1228')).toBe('12 / 28')
    })
})

describe('validateCardNumber', () => {
    it('accepts real test numbers that pass the Luhn check', () => {
        expect(passesLuhn('4242424242424242')).toBe(true)
        expect(validateCardNumber('4242 4242 4242 4242')).toBeNull()
        expect(validateCardNumber('5555 5555 5555 4444')).toBeNull()
        expect(validateCardNumber('3782 822463 10005')).toBeNull()
    })

    it('rejects a mistyped number', () => {
        expect(validateCardNumber('4242 4242 4242 4241')).toBe('Your card number is invalid')
    })

    it('rejects incomplete, too long and empty numbers', () => {
        expect(validateCardNumber('4242 4242')).toBe('Your card number is incomplete')
        expect(validateCardNumber('3782 8224 6310 0051')).toBe('Your card number is invalid')
        expect(validateCardNumber('')).toBe('Enter your card number')
    })
})

describe('validateExpiry', () => {
    it('accepts this month and future dates', () => {
        expect(validateExpiry('10 / 26', NOW)).toBeNull()
        expect(validateExpiry('03 / 29', NOW)).toBeNull()
    })

    it('rejects past dates, bad months and far-future years', () => {
        expect(validateExpiry('09 / 26', NOW)).toBe('Your card has expired')
        expect(validateExpiry('13 / 27', NOW)).toBe('Your expiry month is invalid')
        expect(validateExpiry('01 / 99', NOW)).toBe('Your expiry year is invalid')
        expect(validateExpiry('1', NOW)).toBe('Your expiry date is incomplete')
    })
})

describe('validateCvc and name', () => {
    it('needs 3 digits, or 4 for Amex', () => {
        expect(validateCvc('123', 'visa')).toBeNull()
        expect(validateCvc('12', 'visa')).toBe('Your security code should be 3 digits')
        expect(validateCvc('1234', 'amex')).toBeNull()
        expect(validateCvc('123', 'amex')).toBe('Your security code should be 4 digits')
    })

    it('needs a plausible cardholder name', () => {
        expect(validateCardholderName('Mwafak Almahaini')).toBeNull()
        expect(validateCardholderName('محمد أحمد')).toBeNull()
        expect(validateCardholderName(' ')).toBe('Enter the name on your card')
        expect(validateCardholderName('4242')).toBe('Enter the name as it appears on your card')
    })
})

describe('validateCardForm', () => {
    it('returns no errors for a complete valid card', () => {
        expect(validateCardForm({ name: 'Nour Hassan', number: '4242 4242 4242 4242', expiry: '12 / 28', cvc: '123' }, NOW)).toEqual({})
    })

    it('returns an error per invalid field', () => {
        expect(Object.keys(validateCardForm({ name: '', number: '4242', expiry: '01 / 20', cvc: '' }, NOW)).sort())
            .toEqual(['cvc', 'expiry', 'name', 'number'])
    })
})
