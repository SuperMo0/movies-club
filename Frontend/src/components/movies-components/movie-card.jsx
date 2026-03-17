import React from 'react'
import { Star, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMoviesStore } from '@/stores/movies.store';

export default function MovieCard({ movie }) {


    return (
        <div className="group relative w-full h-full rounded-xl overflow-hidden bg-card border border-white/5 transition-all duration-500 hover:scale-105 hover:shadow-neon-red hover:z-10 cursor-pointer">

            <div className="aspect-2/3 w-full overflow-hidden">
                <img
                    fetchPriority='high'
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>


            <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">


                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">


                    <h3 className="text-lg font-bold text-foreground leading-tight mb-1 drop-shadow-md">
                        {movie.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center text-yellow-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-bold ml-1">4.5</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground truncate max-w-25">
                            {movie.genre?.[0] || 'Action'}
                        </span>
                    </div>

                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-neon-red h-8 text-xs">
                        <Ticket className="w-3 h-3 mr-2" />
                        Show Times
                    </Button>
                </div>
            </div>
        </div>
    )
}