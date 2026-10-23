// Demo auditorium used until Movie Club is connected to a real cinema's ticketing system.
// Layout legend: 'x' seat, 'w' wheelchair space, '_' aisle, ' ' empty floor (keeps blocks aligned).

export type SeatType = 'standard' | 'premium' | 'wheelchair';

export type Seat = {
    id: string,
    row: string,
    number: number,
    type: SeatType,
    taken: boolean,
}

export type SeatCell = { kind: 'seat', seat: Seat } | { kind: 'aisle' } | { kind: 'empty' };

export type SeatRow = {
    label: string,
    premium: boolean,
    cells: SeatCell[],
}

export const MAX_SEATS_PER_BOOKING = 10;

export const SEAT_PRICES: Record<SeatType, number> = {
    standard: 180,
    premium: 260,
    wheelchair: 180,
};

const AUDITORIUM_LAYOUT: { label: string, layout: string, premium?: boolean }[] = [
    { label: 'A', layout: 'w xx_xxxxxxxxxxxx_xx w' },
    { label: 'B', layout: ' xxx_xxxxxxxxxxxx_xxx ' },
    { label: 'C', layout: 'xxxx_xxxxxxxxxxxx_xxxx' },
    { label: 'D', layout: 'xxxx_xxxxxxxxxxxx_xxxx' },
    { label: 'E', layout: 'xxxx_xxxxxxxxxxxx_xxxx' },
    { label: 'F', layout: 'xxxx_xxxxxxxxxxxx_xxxx' },
    { label: 'G', layout: 'xxxx_xxxxxxxxxxxx_xxxx' },
    { label: 'H', layout: 'xxxx_xxxxxxxxxxxx_xxxx' },
    { label: 'J', layout: 'xxxx_xxxxxxxxxxxx_xxxx' },
    { label: 'K', layout: 'xxxx_xxxxxxxxxxxx_xxxx' },
    { label: 'L', layout: 'xxxx_xxxxxxxxxxxx_xxxx', premium: true },
    { label: 'M', layout: 'xxxx_xxxxxxxxxxxx_xxxx', premium: true },
];

// Rows after which the auditorium has a cross aisle (walkway between seating sections).
export const CROSS_AISLE_AFTER = new Set(['K']);

function hashString(value: string) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function seededRandom(seed: number) {
    let state = seed;
    return () => {
        state = (state + 0x6D2B79F5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Builds the seat map for one showtime. Occupied seats are derived from the showtime key,
// so the same showtime always shows the same occupancy.
export function buildSeatMap(showtimeKey: string): SeatRow[] {
    const random = seededRandom(hashString(showtimeKey));
    const occupancy = 0.18 + random() * 0.22;

    return AUDITORIUM_LAYOUT.map(({ label, layout, premium = false }, rowIndex) => {
        const width = layout.length;
        // Middle rows and center seats fill up first, like in a real auditorium.
        const rowBias = 1 - Math.abs(rowIndex - AUDITORIUM_LAYOUT.length * 0.6) / AUDITORIUM_LAYOUT.length;
        let number = 0;
        let previousTaken = false;

        const cells = [...layout].map((char, column): SeatCell => {
            if (char === '_') return { kind: 'aisle' };
            if (char !== 'x' && char !== 'w') return { kind: 'empty' };

            number++;
            const centerBias = 1 - Math.abs(column - (width - 1) / 2) / (width / 2);
            const chance = occupancy * (0.45 + rowBias * 0.6 + centerBias * 0.6);
            // Groups book neighbouring seats, so a taken seat makes its neighbour likelier to be taken.
            const taken = random() < (previousTaken ? chance + 0.35 : chance);
            previousTaken = taken;

            const type: SeatType = char === 'w' ? 'wheelchair' : premium ? 'premium' : 'standard';
            return { kind: 'seat', seat: { id: `${label}${number}`, row: label, number, type, taken } };
        });

        return { label, premium, cells };
    });
}

export function sortSeats(seats: Seat[]) {
    const rowOrder = AUDITORIUM_LAYOUT.map(r => r.label);
    return [...seats].sort((a, b) => rowOrder.indexOf(a.row) - rowOrder.indexOf(b.row) || a.number - b.number);
}

export function getBookingTotal(seats: Seat[]) {
    return seats.reduce((total, seat) => total + SEAT_PRICES[seat.type], 0);
}

export function formatShowDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    if (!year || !month || !day) return date;
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatPrice(amount: number) {
    return `EGP ${amount.toLocaleString('en-US')}`;
}
