import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import MovieHeroCard from './MovieHeroCard'
import Autoplay from "embla-carousel-autoplay"
import { useMoviesStore } from '@/stores/movies.store';

export default function Hero({ handleMovieClick }) {
    const [api, setApi] = useState();

    const { todayMovies } = useMoviesStore();

    function handleInteraction() {
        if (!api) return;
        console.log(api.plugins().autoplay.stop());

    }
    let featuredMovies = [...todayMovies.values()];
    return (
        <div>
            <Carousel opts={{ loop: true }} setApi={setApi} plugins={[
                Autoplay({
                    delay: 2000,
                    stopOnInteraction: true,
                }),

            ]}>
                <CarouselContent>
                    <CarouselItem > <MovieHeroCard handleMovieClick={handleMovieClick} movie={featuredMovies[0]} /> </CarouselItem>
                    <CarouselItem><MovieHeroCard handleMovieClick={handleMovieClick} movie={featuredMovies[1]} /></CarouselItem>
                    <CarouselItem><MovieHeroCard handleMovieClick={handleMovieClick} movie={featuredMovies[2]} /></CarouselItem>
                </CarouselContent>

                <div onClick={handleInteraction}>
                    <CarouselPrevious />
                </div>
                <div onClick={handleInteraction}>
                    <CarouselNext />
                </div>
            </Carousel>
        </div >
    )
}
