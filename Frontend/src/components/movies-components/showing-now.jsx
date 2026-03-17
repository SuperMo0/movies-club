import React from 'react'
import MovieCard from './movie-card.jsx'
import { Flame } from 'lucide-react'
import { useMoviesStore } from '@/stores/movies.store';

export default function ShowingNow({ handleMovieClick }) {


    const { getTodayMovie, todayMovies } = useMoviesStore();


    return (
        <section className="container mx-auto px-4 py-16">

            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Flame className="w-6 h-6 text-primary drop-shadow-glow-red" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-foreground to-muted-foreground">
                    Now in <span className="text-primary drop-shadow-glow-red">Cinemas</span>
                </h1>
            </div>

            <div className="group/grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">

                {[...todayMovies.values()].map((movie, index) => (
                    <div key={index} className="transition-opacity duration-300 group-hover/grid:hover:opacity-100 group-hover/grid:opacity-50"
                        onClick={() => { handleMovieClick(movie) }}>
                        <MovieCard movie={movie} />
                    </div>
                ))}

            </div>
        </section>
    )
}