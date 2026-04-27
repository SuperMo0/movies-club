import { Suspense, useState } from 'react'
import Footer from '@/components/movies-components/footer'
import Hero from '@/components/movies-components/hero'
import ShowingNow from '@/components/movies-components/showing-now'
import MovieBookingModal from '@/components/movies-components/movie-booking-modal'
import LoadingScreen from '@/components/ui/LoadingScreen'
import type { Movie } from 'moviesclub-shared/movies'
import Qsearch from '@/components/movies-components/Qsearch'


export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

    const [activeCinema, setActiveCinema] = useState<string | null>(null);

    function handleMovieClick(movie: Movie) {
        setActiveMovie(movie);
        setIsModalOpen(true);
    }

    function handleModalOpenChange(nextOpen: boolean) {
        setIsModalOpen(nextOpen);
    }


    function handleCinemaSelect(cinema: string | null) {
        setActiveCinema(cinema)
    }

    return (
        <Suspense fallback={<LoadingScreen message="Loading Movies..." />}>
            <div className="relative min-h-screen bg-slate-950">
                <MovieBookingModal
                    open={isModalOpen}
                    onOpenChange={handleModalOpenChange}
                    movie={activeMovie}
                    cinema={activeCinema}
                    key={activeCinema}
                />
                <Qsearch onChange={handleCinemaSelect} cinema={activeCinema} />
                {/* <Hero handleMovieClick={handleMovieClick} /> */}
                <ShowingNow handleMovieClick={handleMovieClick} cinema={activeCinema} />
                <Footer />
            </div>
        </Suspense>

    )
}