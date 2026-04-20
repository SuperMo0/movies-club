import { useState } from 'react'
import Footer from '@/components/movies-components/footer'
import Hero from '@/components/movies-components/hero'
import ShowingNow from '@/components/movies-components/showing-now'
import MovieBookingModal from '@/components/movies-components/movie-booking-modal'

import LoadingScreen from '@/components/ui/LoadingScreen'
import { useTodayMovies } from '@/hooks/use-movies-query'

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [activeMovie, setActiveMovie] = useState(null);

    const { isLoading } = useTodayMovies();

    function handleMovieClick(movie) {
        setActiveMovie(movie);
        setIsModalOpen(true);
    }

    function handleModalOpenChange(nextOpen) {
        setIsModalOpen(nextOpen);
    }

    if (isLoading) return <LoadingScreen message="Loading Movies..." />;

    return (
        <div className="relative min-h-screen bg-slate-950">
            <p className='text-red-500'>some functionalities are not working currently as I'm migrating everything to react-router, typescript and react-hook-form</p>
            <p className='text-red-600'>{"4/20/2026"}</p>

            <MovieBookingModal
                open={isModalOpen}
                onOpenChange={handleModalOpenChange}
                movie={activeMovie}
            />
            <Hero handleMovieClick={handleMovieClick} />
            <ShowingNow handleMovieClick={handleMovieClick} />
            <Footer />
        </div>
    )
}