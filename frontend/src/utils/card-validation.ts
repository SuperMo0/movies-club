// Card checks for the checkout form. Everything here runs in the browser: card details are never
// sent to our backend or stored anywhere.

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'meeza' | 'unknown';

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    meeza: 'Meeza',
    unknown: 'Card',
};

const BRAND_RULES: { brand: Exclude<CardBrand, 'unknown'>, pattern: RegExp, lengths: number[], cvcLength: number }[] = [
    { brand: 'amex', pattern: /^3[47]/, lengths: [15], cvcLength: 4 },
    { brand: 'meeza', pattern: /^507803/, lengths: [16], cvcLength: 3 },
    { brand: 'visa', pattern: /^4/, lengths: [13, 16, 19], cvcLength: 3 },
    { brand: 'mastercard', pattern: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/, lengths: [16], cvcLength: 3 },
];

export function digitsOnly(value: string) {
    return value.replace(/\D/g, '');
}

export function detectCardBrand(cardNumber: string): CardBrand {
    const digits = digitsOnly(cardNumber);
    return BRAND_RULES.find(rule => rule.pattern.test(digits))?.brand ?? 'unknown';
}

function rulesFor(brand: CardBrand) {
    return BRAND_RULES.find(rule => rule.brand === brand);
}

export function cvcLengthFor(brand: CardBrand) {
    return rulesFor(brand)?.cvcLength ?? 3;
}

export function maxCardLength(brand: CardBrand) {
    return Math.max(...(rulesFor(brand)?.lengths ?? [19]));
}

// Groups digits the way they're printed on the card: 4-6-5 for Amex, groups of 4 otherwise.
export function formatCardNumber(value: string) {
    const brand = detectCardBrand(value);
    const digits = digitsOnly(value).slice(0, maxCardLength(brand));
    if (brand === 'amex') {
        return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(' ');
    }
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(value: string) {
    const digits = digitsOnly(value).slice(0, 4);
    if (digits.length === 1 && Number(digits) > 1) return `0${digits} / `;
    if (digits.length < 3) return digits.length === 2 ? `${digits} / ` : digits;
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function passesLuhn(cardNumber: string) {
    const digits = digitsOnly(cardNumber);
    if (!digits) return false;
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        let digit = Number(digits[digits.length - 1 - i]);
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    return sum % 10 === 0;
}

export function validateCardholderName(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return 'Enter the name on your card';
    if (trimmed.length < 2 || !/^[\p{L}][\p{L} .'-]*$/u.test(trimmed)) return 'Enter the name as it appears on your card';
    return null;
}

export function validateCardNumber(cardNumber: string) {
    const digits = digitsOnly(cardNumber);
    if (!digits) return 'Enter your card number';
    const rules = rulesFor(detectCardBrand(digits));
    const lengths = rules?.lengths ?? [12, 13, 14, 15, 16, 17, 18, 19];
    if (digits.length < Math.min(...lengths)) return 'Your card number is incomplete';
    if (!lengths.includes(digits.length) || !passesLuhn(digits)) return 'Your card number is invalid';
    return null;
}

export function validateExpiry(expiry: string, now = new Date()) {
    const digits = digitsOnly(expiry);
    if (!digits) return 'Enter the expiry date';
    if (digits.length < 4) return 'Your expiry date is incomplete';
    const month = Number(digits.slice(0, 2));
    const year = 2000 + Number(digits.slice(2, 4));
    if (month < 1 || month > 12) return 'Your expiry month is invalid';
    // A card is valid until the end of its expiry month.
    const endOfMonth = new Date(year, month, 1);
    if (endOfMonth <= now) return 'Your card has expired';
    if (year > now.getFullYear() + 20) return 'Your expiry year is invalid';
    return null;
}

export function validateCvc(cvc: string, brand: CardBrand) {
    const digits = digitsOnly(cvc);
    const expected = cvcLengthFor(brand);
    if (!digits) return 'Enter the security code';
    if (digits.length !== expected) return `Your security code should be ${expected} digits`;
    return null;
}

export type CardForm = { name: string, number: string, expiry: string, cvc: string };
export type CardErrors = Partial<Record<keyof CardForm, string>>;

export function validateCardForm(form: CardForm, now = new Date()): CardErrors {
    const brand = detectCardBrand(form.number);
    const errors: CardErrors = {};
    const name = validateCardholderName(form.name);
    const number = validateCardNumber(form.number);
    const expiry = validateExpiry(form.expiry, now);
    const cvc = validateCvc(form.cvc, brand);
    if (name) errors.name = name;
    if (number) errors.number = number;
    if (expiry) errors.expiry = expiry;
    if (cvc) errors.cvc = cvc;
    return errors;
}
