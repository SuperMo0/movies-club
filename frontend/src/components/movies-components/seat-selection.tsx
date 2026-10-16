import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Accessibility, ArrowRight, CalendarDays, ChevronLeft, Clock, Lock, MapPin, ShieldCheck, X } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Movie } from 'moviesclub-shared/movies';
import { cn } from '@/lib/utils';
import {
    buildSeatMap,
    CROSS_AISLE_AFTER,
    formatPrice,
    getBookingTotal,
    MAX_SEATS_PER_BOOKING,
    SEAT_PRICES,
    sortSeats,
    type Seat,
} from '@/utils/seat-map';

type SeatSelectionProps = {
    movie: Movie,
    cinema: string,
    date: string,
    time: string,
    onBack: () => void,
}

function formatShowDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    if (!year || !month || !day) return date;
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function seatClasses(seat: Seat, selected: boolean) {
    if (seat.taken) return 'border-slate-800/80 bg-slate-900/60 text-slate-700 cursor-not-allowed after:opacity-0';
    if (selected) return 'border-red-400 bg-red-600 text-white shadow-[0_0_14px_-2px] shadow-red-500/70';
    if (seat.type === 'premium') return 'border-amber-400/50 bg-amber-400/10 text-amber-200/80 hover:border-amber-300 hover:bg-amber-400/25 hover:text-amber-100';
    if (seat.type === 'wheelchair') return 'border-sky-400/50 bg-sky-400/10 text-sky-300 hover:border-sky-300 hover:bg-sky-400/25';
    return 'border-slate-600/70 bg-slate-800/70 text-slate-400 hover:border-red-500 hover:bg-red-500/15 hover:text-white';
}

const seatShape = 'relative rounded-t-[42%] rounded-b-[18%] border after:absolute after:inset-x-[16%] after:bottom-[10%] after:h-[10%] after:rounded-full after:bg-current after:opacity-30';

const legend = [
    { label: 'Available', className: 'border-slate-600/70 bg-slate-800/70 text-slate-400' },
    { label: 'Selected', className: 'border-red-400 bg-red-600 text-white' },
    { label: 'Taken', className: 'border-slate-800/80 bg-slate-900/60 text-slate-700 after:opacity-0' },
    { label: `Premium · ${formatPrice(SEAT_PRICES.premium)}`, className: 'border-amber-400/50 bg-amber-400/10 text-amber-200/80' },
    { label: 'Wheelchair', className: 'border-sky-400/50 bg-sky-400/10 text-sky-300' },
];

export default function SeatSelection({ movie, cinema, date, time, onBack }: SeatSelectionProps) {
    const seatMap = useMemo(() => buildSeatMap(`${cinema}|${movie.title}|${date}|${time}`), [cinema, movie.title, date, time]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showPaymentNotice, setShowPaymentNotice] = useState(false);
    const scrollerRef = useRef<HTMLDivElement>(null);

    const selectedSeats = useMemo(() => {
        const seats = seatMap.flatMap(row => row.cells.flatMap(cell => cell.kind === 'seat' && selectedIds.includes(cell.seat.id) ? [cell.seat] : []));
        return sortSeats(seats);
    }, [seatMap, selectedIds]);

    const total = getBookingTotal(selectedSeats);
    const limitReached = selectedSeats.length >= MAX_SEATS_PER_BOOKING;

    // On narrow screens the auditorium is wider than the viewport, so start scrolled to the middle.
    useEffect(() => {
        const scroller = scrollerRef.current;
        if (scroller) scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
    }, []);

    function toggleSeat(seat: Seat) {
        if (seat.taken) return;
        setShowPaymentNotice(false);
        setSelectedIds(ids => {
            if (ids.includes(seat.id)) return ids.filter(id => id !== seat.id);
            if (ids.length >= MAX_SEATS_PER_BOOKING) return ids;
            return [...ids, seat.id];
        });
    }

    return (
        <div className="flex min-h-0 grow flex-col">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-800/70 py-4 pr-14 pl-4 sm:gap-4 sm:pl-6 md:pl-8">
                <button
                    onClick={onBack}
                    aria-label="Back to showtimes"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-slate-300 transition-colors hover:border-white/25 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                >
                    <ChevronLeft className="size-4" />
                </button>
                <img src={movie.image} alt="" className="hidden h-14 w-10 shrink-0 rounded-md object-cover ring-1 ring-white/10 sm:block" />
                <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-bold tracking-wider text-red-500 uppercase">Select your seats</p>
                    <DialogTitle className="truncate text-lg leading-tight font-bold tracking-tight text-white sm:text-xl">
                        {movie.title}
                    </DialogTitle>
                    <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-slate-500" />{cinema}</span>
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 shrink-0 text-slate-500" />{formatShowDate(date)}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5 shrink-0 text-slate-500" />{time}</span>
                    </DialogDescription>
                </div>
            </div>

            {/* Auditorium */}
            <div className="min-h-0 grow overflow-y-auto hidden-scrollbar">
                <div ref={scrollerRef} className="@container overflow-x-auto px-4 pt-6 pb-4 hidden-scrollbar sm:px-6 md:px-8 md:pt-8">
                    <div
                        className="mx-auto flex w-max flex-col items-center"
                        style={{ '--seat': 'clamp(1.375rem, min(calc((100cqi - 3rem) / 28), calc((var(--stable-vh, 1dvh) * 85 - 23rem) / 16)), 2rem)', '--gap': 'calc(var(--seat) * 0.18)' } as CSSProperties}
                    >

                        {/* Screen */}
                        <div className="relative mb-[calc(var(--seat)*1.4)] w-[92%]">
                            <svg viewBox="0 0 1000 70" className="w-full overflow-visible drop-shadow-[0_0_12px_rgba(248,113,113,0.55)]" aria-hidden="true">
                                <defs>
                                    <linearGradient id="screen-stroke" x1="0" x2="1" y1="0" y2="0">
                                        <stop offset="0%" stopColor="#f87171" stopOpacity="0" />
                                        <stop offset="20%" stopColor="#fca5a5" stopOpacity="0.9" />
                                        <stop offset="50%" stopColor="#ffffff" />
                                        <stop offset="80%" stopColor="#fca5a5" stopOpacity="0.9" />
                                        <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="screen-glow" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#f87171" stopOpacity="0.22" />
                                        <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M 10 50 Q 500 -6 990 50 L 920 70 Q 500 30 80 70 Z" fill="url(#screen-glow)" />
                                <path d="M 10 50 Q 500 -6 990 50" fill="none" stroke="url(#screen-stroke)" strokeWidth="5" strokeLinecap="round" />
                            </svg>
                            <p className="mt-1 text-center text-[10px] font-semibold tracking-[0.6em] text-slate-500 uppercase">Screen</p>
                        </div>

                        {/* Seats */}
                        <div className="flex flex-col gap-(--gap)" role="group" aria-label="Seat map">
                            {seatMap.map(row => (
                                <div key={row.label}>
                                    <div className="flex items-center gap-(--gap)">
                                        <RowLabel label={row.label} premium={row.premium} side="left" />
                                        {row.cells.map((cell, i) => {
                                            if (cell.kind === 'aisle') return <div key={i} className="w-[calc(var(--seat)*0.7)] shrink-0" />;
                                            if (cell.kind === 'empty') return <div key={i} className="size-(--seat) shrink-0" />;

                                            const { seat } = cell;
                                            const selected = selectedIds.includes(seat.id);
                                            const blocked = !selected && limitReached;
                                            return (
                                                <button
                                                    key={seat.id}
                                                    type="button"
                                                    disabled={seat.taken}
                                                    aria-pressed={selected}
                                                    aria-disabled={blocked || undefined}
                                                    aria-label={`Row ${seat.row}, seat ${seat.number}, ${seat.type}${seat.taken ? ', taken' : ''}`}
                                                    title={seat.taken ? `${seat.id} · Taken` : `${seat.id} · ${formatPrice(SEAT_PRICES[seat.type])}`}
                                                    onClick={() => toggleSeat(seat)}
                                                    className={cn(
                                                        seatShape,
                                                        'flex size-(--seat) shrink-0 items-center justify-center transition-all duration-150 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none',
                                                        !seat.taken && !blocked && 'active:scale-90',
                                                        blocked && 'cursor-not-allowed opacity-60',
                                                        seatClasses(seat, selected),
                                                    )}
                                                >
                                                    {seat.type === 'wheelchair' && !selected
                                                        ? <Accessibility className="size-[55%] -translate-y-[6%]" />
                                                        : !seat.taken && <span className="hidden -translate-y-[8%] text-[9px] leading-none font-semibold tabular-nums @2xl:inline @4xl:text-[10px]">{seat.number}</span>}
                                                </button>
                                            );
                                        })}
                                        <RowLabel label={row.label} premium={row.premium} side="right" />
                                    </div>

                                    {CROSS_AISLE_AFTER.has(row.label) && (
                                        <div className="my-[calc(var(--seat)*0.45)] flex items-center gap-3 px-(--seat)">
                                            <div className="h-px grow bg-linear-to-r from-transparent to-amber-400/30" />
                                            <span className="text-[9px] font-semibold tracking-[0.3em] text-amber-300/70 uppercase">Premium</span>
                                            <div className="h-px grow bg-linear-to-l from-transparent to-amber-400/30" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 pb-6 text-xs text-slate-400">
                    {legend.map(item => (
                        <span key={item.label} className="inline-flex items-center gap-2">
                            <span className={cn(seatShape, 'size-4', item.className)} />
                            {item.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="border-t border-slate-800/70 bg-slate-950/95 px-4 py-4 backdrop-blur-sm sm:px-6 md:px-8">
                {showPaymentNotice && (
                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm animate-in fade-in slide-in-from-bottom-2">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                        <p className="grow text-slate-300">
                            <span className="font-semibold text-white">Secure checkout opens here.</span>{' '}
                            Payment goes live once Movie Club is connected to {cinema}'s ticketing system.
                        </p>
                        <button onClick={() => setShowPaymentNotice(false)} aria-label="Dismiss" className="text-slate-500 transition-colors hover:text-white">
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        {selectedSeats.length > 0 ? (
                            <>
                                <p className="mb-2 text-xs font-medium text-slate-500 uppercase">
                                    {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} selected
                                    {limitReached && <span className="ml-2 tracking-normal text-amber-400 normal-case">· Max {MAX_SEATS_PER_BOOKING} per booking</span>}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedSeats.map(seat => (
                                        <button
                                            key={seat.id}
                                            onClick={() => toggleSeat(seat)}
                                            aria-label={`Remove seat ${seat.id}`}
                                            className={cn(
                                                'group inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold tabular-nums transition-colors',
                                                seat.type === 'premium'
                                                    ? 'border-amber-400/40 bg-amber-400/10 text-amber-200 hover:border-amber-300'
                                                    : 'border-red-500/40 bg-red-500/10 text-red-200 hover:border-red-400',
                                            )}
                                        >
                                            {seat.id}
                                            <X className="size-3 opacity-50 group-hover:opacity-100" />
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-slate-500">
                                Pick up to {MAX_SEATS_PER_BOOKING} seats · Standard {formatPrice(SEAT_PRICES.standard)}
                            </p>
                        )}
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:flex-nowrap sm:justify-end sm:gap-5">
                        <div className="whitespace-nowrap sm:text-right">
                            <p className="text-[10px] font-medium tracking-wider text-slate-500 uppercase">Total</p>
                            <p className="text-xl font-bold text-white tabular-nums">{formatPrice(total)}</p>
                        </div>
                        <button
                            disabled={selectedSeats.length === 0}
                            onClick={() => setShowPaymentNotice(true)}
                            className="inline-flex grow items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 whitespace-nowrap sm:grow-0 sm:px-6 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
                        >
                            <Lock className="hidden size-4 min-[400px]:block" />
                            Proceed to Payment
                            <ArrowRight className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Row labels stay pinned to the edges while the auditorium is scrolled sideways on small screens.
function RowLabel({ label, premium, side }: { label: string, premium: boolean, side: 'left' | 'right' }) {
    return (
        <span className={cn(
            'sticky z-10 w-(--seat) shrink-0 bg-slate-950 text-center text-[11px] leading-(--seat) font-semibold',
            side === 'left' ? 'left-0' : 'right-0',
            premium ? 'text-amber-300/70' : 'text-slate-500',
        )}>
            {label}
        </span>
    );
}
