import { useState } from 'react';
import { Film, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMoviesStore } from '@/stores/movies.store';

const RATING_SCALE = [1, 2, 3, 4, 5];

export function SelectedMovieCard({ selectedMovie, rating, setRating, onClear }) {
    const todayMovies = useMoviesStore(s => s.todayMovies);
    const [hoverRating, setHoverRating] = useState(0);

    const movie = todayMovies.get(selectedMovie);
    if (!movie) return null;

    return (
        <div className="flex flex-wrap items-center gap-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                <Film className="w-4 h-4" />
                {movie.title}
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
                            className={`w-5 h-5 transition-colors ${star <= (hoverRating || rating)
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

export function MovieSelectorDropdown({ isVisible, onClose, onSelect }) {
    const todayMovies = useMoviesStore(s => s.todayMovies);

    if (!isVisible) return null;

    return (
        <div className="absolute top-full left-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                Recent Releases
            </div>
            {[...todayMovies.values()].map(movie => (
                <Button
                    key={movie.id}
                    type='button'
                    variant='dropdown-item'
                    onClick={() => {
                        onSelect(movie.id);
                        onClose();
                    }}
                >
                    <Film className="w-3 h-3 opacity-50" />
                    {movie.title}
                </Button>
            ))}
        </div>
    );
}
