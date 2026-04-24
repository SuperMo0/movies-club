import { useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import MovieHeroCard from './movie-hero-card'
import Autoplay from "embla-carousel-autoplay"
import { useTodayMovies } from '@/hooks/use-movies-query';

export default function Hero({ handleMovieClick }) {
    const [api, setApi] = useState();

    const { data: todayMovies } = useTodayMovies();

    function handleInteraction() {
        if (!api) return;
        api.plugins().autoplay.stop();
    }

    const featuredMovies = todayMovies.slice(0, 3);

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
