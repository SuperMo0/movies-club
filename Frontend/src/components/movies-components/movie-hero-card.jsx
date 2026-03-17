import { Button } from '@/components/ui/button'
import { PlayCircle, CalendarClock } from 'lucide-react'
import React from 'react'

export default function MovieHeroCard({ movie, handleMovieClick }) {


    {/* if (!movie.genre) console.log(movie);*/ }

    return (
        <div className="relative w-full overflow-hidden flex flex-col bg-background">

            <div className="absolute inset-0 z-0">
                <img
                    src={movie.image}
                    alt="backdrop"
                    className="w-full h-full object-cover blur-3xl opacity-30 scale-125"
                />
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent z-0" />
            <div className="absolute inset-0 bg-linear-to-r from-background/50 via-transparent to-background/50 z-0" />

            <div className="container relative z-10 mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-start md:justify-center gap-8 md:gap-12 py-10 pt-28 md:pt-10">


                <div className="shrink-0 w-50 md:w-75 lg:w-87.5 animate-in zoom-in-95 duration-700">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 group">
                        <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute -inset-4 bg-primary/20 blur-xl -z-10 rounded-full opacity-50" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-5 md:gap-6 animate-in slide-in-from-right-10 duration-700">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-glow-white leading-tight">
                        {movie.title}
                    </h1>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {movie.genre.map((ge, index) => (
                            <div
                                key={index}
                                className="bg-secondary/10 border border-secondary/40 text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider hover:shadow-neon-purple transition-all"
                            >
                                {ge}
                            </div>
                        ))}
                    </div>

                    <p className="text-muted-foreground text-sm md:text-lg leading-relaxed max-w-xl line-clamp-4 md:line-clamp-none">
                        {movie.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-neon-red w-full sm:w-auto h-12"
                            onClick={() => { handleMovieClick(movie) }}
                        >
                            <CalendarClock className="mr-2 h-5 w-5" />
                            Show Times
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-transparent border-white/20 hover:bg-white/10 text-foreground w-full sm:w-auto h-12"
                        >
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Watch Trailer
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}