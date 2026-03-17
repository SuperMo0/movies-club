import { Star } from 'lucide-react'

export default function RatingStars({ rating = 0, size = 'w-3 h-3' }) {
    const safeRating = Number.isFinite(rating) ? rating : 0

    return (
        <div className='flex gap-0.5'>
            {Array.from({ length: 5 }, (_, index) => {
                const isFilled = index < Math.floor(safeRating)
                return (
                    <Star
                        key={index}
                        className={`${size} ${isFilled ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`}
                    />
                )
            })}
        </div>
    )
}
