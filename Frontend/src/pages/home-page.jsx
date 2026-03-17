import { useEffect, useState } from 'react'
import Footer from '@/components/movies-components/footer'
import Hero from '@/components/movies-components/hero'
import ShowingNow from '@/components/movies-components/showing-now'
import MovieBookingModal from '@/components/movies-components/movie-booking-modal'

import { useMoviesStore } from '@/stores/movies.store'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMovie, setActiveMovie] = useState(null);
    const [activeMovieImdb, setActiveMovieImdb] = useState(null);

    const { getTodayMovie, todayMovies, getAllMovies, allMovies } = useMoviesStore();


    useEffect(() => {

        getTodayMovie();
        getAllMovies();

    }, [])
    function handleMovieClick(movie, imdbData = null) {
        setActiveMovie(movie);
        setActiveMovieImdb(imdbData);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setActiveMovieImdb(null);
    }

    function handleModalOpenChange(nextOpen) {
        setIsModalOpen(nextOpen);
        if (!nextOpen) {
            setActiveMovieImdb(null);
        }
    }

    if (!todayMovies || !allMovies) return <LoadingScreen message="Loading Movies..." />;

    return (
        <div className="relative min-h-screen bg-slate-950">
            <MovieBookingModal
                open={isModalOpen}
                onOpenChange={handleModalOpenChange}
                movie={activeMovie}
                imdbData={activeMovieImdb}
            />
            <Hero handleMovieClick={handleMovieClick} />  {/*This component is heavy my fans are going crazy !*/}
            <ShowingNow handleMovieClick={handleMovieClick} />
            <Footer />
        </div>
    )
}