import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { CalendarDays, ChevronLeft, Clock, CreditCard, Loader2, Lock, MapPin, ShieldCheck, XCircle } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Movie } from 'moviesclub-shared/movies';
import { cn } from '@/lib/utils';
import { formatPrice, formatShowDate, getBookingTotal, SEAT_PRICES, type Seat } from '@/utils/seat-map';
import {
    CARD_BRAND_LABELS,
    cvcLengthFor,
    detectCardBrand,
    digitsOnly,
    formatCardNumber,
    formatExpiry,
    validateCardForm,
    type CardBrand,
    type CardErrors,
    type CardForm,
} from '@/utils/card-validation';

type CheckoutProps = {
    movie: Movie,
    cinema: string,
    date: string,
    time: string,
    seats: Seat[],
    onBack: () => void,
}

type Status = 'form' | 'processing' | 'failed';

const SEAT_TYPE_LABELS: Record<Seat['type'], string> = { standard: 'Standard', premium: 'Premium', wheelchair: 'Wheelchair' };

const PROCESSING_MS = 2600;

// Card details live only in this component's state: the form never posts anywhere and nothing is
// stored or sent to our backend. A valid card goes through "processing" and then shows a payment
// failure; an invalid one is caught by the field checks.
export default function Checkout({ movie, cinema, date, time, seats, onBack }: CheckoutProps) {
    const formId = useId();
    const [form, setForm] = useState<CardForm>({ name: '', number: '', expiry: '', cvc: '' });
    const [touched, setTouched] = useState<Partial<Record<keyof CardForm, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState<Status>('form');
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const brand = detectCardBrand(form.number);
    const errors = validateCardForm(form);
    const visibleError = (field: keyof CardForm) => (submitted || touched[field]) ? errors[field] : undefined;
    const total = getBookingTotal(seats);

    function update(field: keyof CardForm) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value;
            if (field === 'number') value = formatCardNumber(value);
            if (field === 'expiry') {
                // Let backspace remove the " / " separator instead of re-adding it.
                const deleting = value.length < form.expiry.length && form.expiry.startsWith(value);
                value = deleting ? value.replace(/\s*\/\s*$/, '') : formatExpiry(value);
            }
            if (field === 'cvc') value = digitsOnly(value).slice(0, cvcLengthFor(brand));
            setForm(f => ({ ...f, [field]: value }));
        };
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitted(true);
        if (Object.keys(errors).length > 0) {
            const firstInvalid = (['name', 'number', 'expiry', 'cvc'] as const).find(f => errors[f]);
            document.getElementById(`${formId}-${firstInvalid}`)?.focus();
            return;
        }
        setStatus('processing');
        timer.current = setTimeout(() => setStatus('failed'), PROCESSING_MS);
    }

    function tryAgain() {
        setForm(f => ({ ...f, cvc: '' }));
        setTouched(t => ({ ...t, cvc: false }));
        setSubmitted(false);
        setStatus('form');
    }

    return (
        <div className="flex min-h-0 grow flex-col">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-800/70 py-4 pr-14 pl-4 sm:gap-4 sm:pl-6 md:pl-8">
                <button
                    onClick={onBack}
                    disabled={status === 'processing'}
                    aria-label="Back to seats"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-slate-300 transition-colors hover:border-white/25 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none disabled:opacity-40"
                >
                    <ChevronLeft className="size-4" />
                </button>
                <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-bold tracking-wider text-red-500 uppercase">Checkout</p>
                    <DialogTitle className="truncate text-lg leading-tight font-bold tracking-tight text-white sm:text-xl">
                        {status === 'failed' ? 'Payment unsuccessful' : 'Payment details'}
                    </DialogTitle>
                    <DialogDescription className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <Lock className="size-3.5 shrink-0 text-emerald-400" /> Secure checkout
                    </DialogDescription>
                </div>
            </div>

            <div className="min-h-0 grow overflow-y-auto hidden-scrollbar">
                <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-8 md:p-8">

                    {/* Order summary */}
                    <section aria-label="Order summary" className="h-fit rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
                        <div className="flex gap-4">
                            <img src={movie.image} alt="" className="h-24 w-16 shrink-0 rounded-lg object-cover ring-1 ring-white/10" />
                            <div className="min-w-0 space-y-1.5">
                                <p className="truncate font-bold text-white">{movie.title}</p>
                                <p className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="size-3.5 shrink-0 text-slate-500" /><span className="truncate">{cinema}</span></p>
                                <p className="flex items-center gap-1.5 text-xs text-slate-400"><CalendarDays className="size-3.5 shrink-0 text-slate-500" />{formatShowDate(date)}</p>
                                <p className="flex items-center gap-1.5 text-xs text-slate-400"><Clock className="size-3.5 shrink-0 text-slate-500" />{time}</p>
                            </div>
                        </div>

                        <div className="my-4 h-px bg-slate-800" />

                        <p className="mb-2 text-xs font-medium text-slate-500 uppercase">{seats.length} {seats.length === 1 ? 'ticket' : 'tickets'}</p>
                        <ul className="space-y-2 text-sm">
                            {seats.map(seat => (
                                <li key={seat.id} className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-slate-300">
                                        <span className={cn(
                                            'rounded-md border px-1.5 py-0.5 text-xs font-semibold tabular-nums',
                                            seat.type === 'premium' ? 'border-amber-400/40 bg-amber-400/10 text-amber-200' : 'border-slate-700 bg-slate-800/70 text-slate-200',
                                        )}>{seat.id}</span>
                                        {SEAT_TYPE_LABELS[seat.type]}
                                    </span>
                                    <span className="text-slate-300 tabular-nums">{formatPrice(SEAT_PRICES[seat.type])}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-slate-700 pt-4">
                            <span className="text-sm font-medium text-slate-300">Total</span>
                            <span className="text-2xl font-bold text-white tabular-nums">{formatPrice(total)}</span>
                        </div>
                        <p className="mt-1 text-right text-[11px] text-slate-500">All prices in Egyptian pounds (EGP)</p>
                    </section>

                    {/* Payment */}
                    <section aria-label="Payment">
                        {status === 'failed' ? (
                            <div className="flex flex-col items-center rounded-2xl border border-red-500/25 bg-red-500/5 px-5 py-8 text-center animate-in fade-in zoom-in-95">
                                <XCircle className="mb-4 size-12 text-red-500" />
                                <h3 className="text-lg font-bold text-white">We couldn't complete your payment</h3>
                                <p className="mt-2 max-w-sm text-sm text-slate-400">
                                    The payment didn't go through, so your card hasn't been charged and your seats weren't booked.
                                    Please try again in a few minutes or use a different card.
                                </p>
                                <div className="mt-6 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                    <button onClick={tryAgain} className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700">
                                        Try again
                                    </button>
                                    <button onClick={onBack} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500">
                                        Change seats
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form id={formId} noValidate onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-white"><CreditCard className="size-4 text-slate-400" /> Card</h3>
                                    <div className="flex items-center gap-1.5" aria-label="Accepted cards">
                                        {(['visa', 'mastercard', 'amex', 'meeza'] as const).map(b => <BrandMark key={b} brand={b} dim={brand !== 'unknown' && brand !== b} />)}
                                    </div>
                                </div>

                                <Field id={`${formId}-name`} label="Name on card" error={visibleError('name')}>
                                    <input
                                        id={`${formId}-name`} name="cc-name" autoComplete="cc-name" placeholder="As it appears on your card"
                                        value={form.name} onChange={update('name')} onBlur={() => setTouched(t => ({ ...t, name: true }))}
                                        disabled={status === 'processing'} aria-invalid={!!visibleError('name')} className={inputClass(!!visibleError('name'))}
                                    />
                                </Field>

                                <Field id={`${formId}-number`} label="Card number" error={visibleError('number')}>
                                    <div className="relative">
                                        <input
                                            id={`${formId}-number`} name="cc-number" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234"
                                            value={form.number} onChange={update('number')} onBlur={() => setTouched(t => ({ ...t, number: true }))}
                                            disabled={status === 'processing'} aria-invalid={!!visibleError('number')} className={cn(inputClass(!!visibleError('number')), 'pr-20 tabular-nums')}
                                        />
                                        <span className="absolute top-1/2 right-3 -translate-y-1/2">
                                            {brand !== 'unknown' ? <BrandMark brand={brand} /> : <CreditCard className="size-5 text-slate-600" />}
                                        </span>
                                    </div>
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field id={`${formId}-expiry`} label="Expiry date" error={visibleError('expiry')}>
                                        <input
                                            id={`${formId}-expiry`} name="cc-exp" autoComplete="cc-exp" inputMode="numeric" placeholder="MM / YY"
                                            value={form.expiry} onChange={update('expiry')} onBlur={() => setTouched(t => ({ ...t, expiry: true }))}
                                            disabled={status === 'processing'} aria-invalid={!!visibleError('expiry')} className={cn(inputClass(!!visibleError('expiry')), 'tabular-nums')}
                                        />
                                    </Field>
                                    <Field id={`${formId}-cvc`} label="Security code" error={visibleError('cvc')}>
                                        <input
                                            id={`${formId}-cvc`} name="cc-csc" autoComplete="cc-csc" inputMode="numeric" placeholder={brand === 'amex' ? '4 digits' : 'CVC'}
                                            value={form.cvc} onChange={update('cvc')} onBlur={() => setTouched(t => ({ ...t, cvc: true }))}
                                            disabled={status === 'processing'} aria-invalid={!!visibleError('cvc')} className={cn(inputClass(!!visibleError('cvc')), 'tabular-nums')}
                                        />
                                    </Field>
                                </div>

                                <p className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-400">
                                    <ShieldCheck className="mt-px size-4 shrink-0 text-emerald-400" />
                                    Your card details are never stored.
                                </p>
                            </form>
                        )}
                    </section>
                </div>
            </div>

            {/* Pay bar */}
            {status !== 'failed' && (
                <div className="flex items-center justify-between gap-4 border-t border-slate-800/70 bg-slate-950/95 px-4 py-4 backdrop-blur-sm sm:px-6 md:px-8">
                    {/* The pay button shows the amount too, so the separate total can go on very narrow phones. */}
                    <div className="hidden whitespace-nowrap min-[380px]:block">
                        <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">Total</p>
                        <p className="text-xl font-bold text-white tabular-nums">{formatPrice(total)}</p>
                    </div>
                    <button
                        type="submit"
                        form={formId}
                        disabled={status === 'processing'}
                        className="inline-flex grow items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-red-900/30 transition-colors hover:bg-red-700 disabled:cursor-wait disabled:opacity-80 sm:grow-0 sm:px-8"
                    >
                        {status === 'processing'
                            ? <><Loader2 className="size-4 animate-spin" /> Processing…</>
                            : <><Lock className="size-4" /> Pay {formatPrice(total)}</>}
                    </button>
                </div>
            )}
        </div>
    );
}

function inputClass(invalid: boolean) {
    return cn(
        'h-12 w-full rounded-xl border bg-slate-900/60 px-4 text-sm text-white placeholder:text-slate-600 outline-none transition-colors disabled:opacity-60',
        'focus:border-slate-500 focus:ring-2 focus:ring-white/10',
        invalid ? 'border-red-500/80 focus:border-red-500' : 'border-slate-700',
    );
}

function Field({ id, label, error, children }: { id: string, label: string, error?: string, children: ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-xs font-medium text-slate-400">{label}</label>
            {children}
            {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

function BrandMark({ brand, dim = false }: { brand: Exclude<CardBrand, 'unknown'>, dim?: boolean }) {
    const base = cn('flex h-6 w-10 items-center justify-center rounded border text-[9px] font-black tracking-tight transition-opacity', dim && 'opacity-30');
    if (brand === 'mastercard') {
        return (
            <span title={CARD_BRAND_LABELS[brand]} className={cn(base, 'border-slate-700 bg-slate-900')}>
                <svg viewBox="0 0 24 16" className="h-3.5" aria-hidden="true">
                    <circle cx="9" cy="8" r="6.5" fill="#EB001B" />
                    <circle cx="15" cy="8" r="6.5" fill="#F79E1B" fillOpacity="0.9" />
                </svg>
                <span className="sr-only">Mastercard</span>
            </span>
        );
    }
    const styles: Record<'visa' | 'amex' | 'meeza', string> = {
        visa: 'border-slate-200 bg-white italic text-[#1A1F71] text-[10px]',
        amex: 'border-[#2E77BC] bg-[#2E77BC] text-white',
        meeza: 'border-emerald-700 bg-emerald-800 text-white',
    };
    const text = { visa: 'VISA', amex: 'AMEX', meeza: 'meeza' }[brand];
    return <span title={CARD_BRAND_LABELS[brand]} className={cn(base, styles[brand])}>{text}</span>;
}
