import { useState } from 'react';
import { Film, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTodayMovies } from '@/hooks/use-movies-query';
import type { Movie } from 'moviesclub-shared/movies';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const RATING_SCALE = [1, 2, 3, 4, 5];

type SelectMovieCardProps = {
    movieTitle: string | null,
    rating?: number | null | string,
    setRating: (r: number) => void,
    onClear: () => void
}

export function SelectedMovieCard({ movieTitle, rating, setRating, onClear }: SelectMovieCardProps) {

    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex flex-wrap items-center gap-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                <Film className="w-4 h-4" />
                {movieTitle}
            </div>

            <div className="h-4 w-px bg-slate-700"></div>

            <div className="flex items-center gap-1">
                {RATING_SCALE.map((star) => (
                    <Button
                        key={star}
                        type='button'
                        variant='star-action'
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                    >
                        <Star
                            className={`w-5 h-5 transition-colors ${star <= (Number(hoverRating) || Number(rating))
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-slate-600'
                                }`}
                        />
                    </Button>
                ))}
            </div>

            <Button
                type='button'
                variant='clear-action'
                onClick={onClear}
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    );
}

type MovieSelector = {
    onChange: (movieTitle: string) => void
    value?: string
}

export function MovieSelectorDropdown({ value, onChange }: MovieSelector) {

    const { data: todayMovies } = useTodayMovies();

    return (
        <Select name='select movie' value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Rate a movie" />
                <Film className='w-5 h-5' />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>TODAY MOVIES</SelectLabel>
                    {
                        todayMovies?.map((m: Movie, ix) => {
                            return <SelectItem key={m.id} value={m.title} >{m.title}</SelectItem>
                        })
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
