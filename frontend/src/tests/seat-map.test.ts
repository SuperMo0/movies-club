import { describe, it, expect } from 'vitest'
import { buildSeatMap, getBookingTotal, sortSeats, formatPrice, SEAT_PRICES, type Seat } from '@/utils/seat-map'

function seatsOf(key: string) {
    return buildSeatMap(key).flatMap(row => row.cells.flatMap(cell => cell.kind === 'seat' ? [cell.seat] : []))
}

describe('buildSeatMap', () => {
    it('gives the same occupancy for the same showtime', () => {
        expect(buildSeatMap('Vox|Dune|2026-10-16|07:30 PM')).toEqual(buildSeatMap('Vox|Dune|2026-10-16|07:30 PM'))
    })

    it('gives different occupancy for different showtimes', () => {
        const taken = (key: string) => seatsOf(key).filter(s => s.taken).map(s => s.id)
        expect(taken('Vox|Dune|2026-10-16|07:30 PM')).not.toEqual(taken('Vox|Dune|2026-10-16|10:45 PM'))
    })

    it('labels seats by row letter and number with unique ids, skipping the letter I', () => {
        const seats = seatsOf('any')
        expect(new Set(seats.map(s => s.id)).size).toBe(seats.length)
        expect(seats.some(s => s.row === 'I')).toBe(false)
        expect(seats.filter(s => s.row === 'C').map(s => s.number)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
    })

    it('keeps a realistic share of seats free', () => {
        const seats = seatsOf('Vox|Dune|2026-10-16|07:30 PM')
        const takenShare = seats.filter(s => s.taken).length / seats.length
        expect(takenShare).toBeGreaterThan(0.1)
        expect(takenShare).toBeLessThan(0.6)
    })

    it('marks the back rows as premium and has wheelchair spaces in the front row', () => {
        const seats = seatsOf('any')
        expect(new Set(seats.filter(s => s.type === 'premium').map(s => s.row))).toEqual(new Set(['L', 'M']))
        expect(seats.filter(s => s.type === 'wheelchair').every(s => s.row === 'A')).toBe(true)
    })
})

describe('booking helpers', () => {
    const seat = (row: string, number: number, type: Seat['type'] = 'standard'): Seat => ({ id: `${row}${number}`, row, number, type, taken: false })

    it('sorts seats by row order then seat number', () => {
        expect(sortSeats([seat('L', 2), seat('C', 10), seat('C', 2)]).map(s => s.id)).toEqual(['C2', 'C10', 'L2'])
    })

    it('sums the price of each seat type', () => {
        expect(getBookingTotal([seat('C', 1), seat('L', 1, 'premium')])).toBe(SEAT_PRICES.standard + SEAT_PRICES.premium)
        expect(getBookingTotal([])).toBe(0)
    })

    it('formats prices in Egyptian pounds', () => {
        expect(formatPrice(1440)).toBe('EGP 1,440')
    })
})
