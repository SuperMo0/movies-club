import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Movie } from 'moviesclub-shared/movies';
import CinemaSelector from './cinema-selector';
import { useTodayCinemas } from '@/hooks/use-movies-query';

type MovieBookingModalProps = {
    open: boolean,
    onOpenChange: (x: boolean) => void,
    movie: Movie | null
    cinema: string | null
}

export default function MovieBookingModal({ open, onOpenChange, movie, cinema }: MovieBookingModalProps) {

    const todayDate = new Date().toLocaleDateString('en-CA');
    const [selectedDate, setSelectedDate] = useState(todayDate);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCinema, setSelectedCinema] = useState<string | null>(cinema);

    const { data: cinemas } = useTodayCinemas();

    function handleDateChange(newDate: string) {
        setSelectedDate(newDate);
        setSelectedTime(null);
    };

    function handleCinemaChange(cinema: string) {
        setSelectedCinema(cinema);
    }

    if (!movie) return null;
    const schedule = (selectedCinema && movie) ? (cinemas?.[selectedCinema]?.[movie.title]?.[selectedDate]) || [] : [];
    const days = (selectedCinema && movie && cinemas[selectedCinema]?.[movie.title]) ? Object.keys(cinemas[selectedCinema][movie.title]) : [];
    const cinemasShowing = Object.keys(cinemas).filter(c => !!cinemas[c][movie.title]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100vw-1rem)] max-h-[80dvh] overflow-y-scroll md:overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-0 shadow-2xl sm:w-full sm:rounded-2xl md:w-[min(96vw,72rem)] md:max-w-6xl">
                <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto hidden-scrollbar">

                    {/* Image Section */}
                    <div className="relative h-60 shrink-0 md:h-auto w-full md:w-[38%]">
                        <img
                            src={movie.image}
                            className="w-full h-full object-cover"
                            alt={movie.title}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent md:bg-linear-to-r" />
                    </div>

                    {/* Content Section */}
                    <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6 md:p-8">

                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                                    Now Showing
                                </span>
                                <span className="text-slate-400 text-xs">
                                    {Array.isArray(movie.genre) ? movie.genre.join(' • ') : (movie.genre || "Cinema")}
                                </span>
                            </div>
                            <DialogTitle className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                                {movie.title}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 text-sm line-clamp-2">
                                {movie.description || "Experience the thrill on the big screen."}
                            </DialogDescription>
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-yellow-500">
                                    IMDb
                                </span>
                            </div>
                        </div>

                        {/* Inputs Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 uppercase">Cinema</label>
                                <CinemaSelector onChange={handleCinemaChange} value={selectedCinema} placeholder='Select Cinema' values={cinemasShowing} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 uppercase">Date</label>
                                <CinemaSelector onChange={handleDateChange} value={selectedDate} placeholder='Select Date' values={days} />
                            </div>
                        </div>

                        {/* Time Selection */}
                        {schedule && (
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Available Times
                                </label>

                                <div className="flex flex-wrap gap-3">
                                    {schedule.length > 0 ? (
                                        schedule.map((time, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedTime(time)}
                                                className={`
                                                    px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                                                    ${selectedTime === time
                                                        ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                                                        : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-red-500 hover:text-red-400'
                                                    }
                                                `}
                                            >
                                                {time}
                                            </button>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">No times scheduled for this cinema.</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-auto pt-4 flex justify-end border-t border-slate-800/50">
                            <button
                                disabled={!selectedTime}
                                className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200 px-8 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {selectedTime ? `Book for ${selectedTime}` : 'Select a Time'}
                            </button>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}