import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import MovieHeroCard from './movie-hero-card'
import Autoplay from "embla-carousel-autoplay"
import { useMoviesStore } from '@/stores/movies.store';
import { getImdbCacheKey, searchImdbTitle } from '@/lib/imdb';

export default function Hero({ handleMovieClick }) {
    const [api, setApi] = useState();
    const [featuredImdb, setFeaturedImdb] = useState({});

    const { todayMovies } = useMoviesStore();

    function handleInteraction() {
        if (!api) return;
        console.log(api.plugins().autoplay.stop());

    }
    const featuredMovies = [...todayMovies.values()].slice(0, 3);

    useEffect(() => {
        featuredMovies.forEach(async (movie) => {
            const key = getImdbCacheKey(movie?.title);
            if (!key) return;

            const result = await searchImdbTitle(movie.title);
            setFeaturedImdb((prev) => ({ ...prev, [key]: result }));
        });
    }, [todayMovies]);

    return (
        <div>
            <Carousel opts={{ loop: true }} setApi={setApi} plugins={[
                Autoplay({
                    delay: 2000,
                    stopOnInteraction: true,
                }),

            ]}>
                <CarouselContent>
                    {featuredMovies.map((movie) => (
                        <CarouselItem key={movie.id}>
                            <MovieHeroCard
                                handleMovieClick={handleMovieClick}
                                movie={movie}
                                imdbData={featuredImdb[getImdbCacheKey(movie?.title)] || null}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <div className='hidden md:block' onClick={handleInteraction}>
                    <CarouselPrevious />
                </div>
                <div className='hidden md:block' onClick={handleInteraction}>
                    <CarouselNext />
                </div>
            </Carousel>
        </div >
    )
}
