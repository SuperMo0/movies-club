import { useState, useEffect } from 'react';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Movie } from 'moviesclub-shared/movies';

type MovieBookingModalProps = {
    open: () => void,
    onOpenChange: () => void,
    movie: Movie
}
export default function MovieBookingModal({ open, onOpenChange, movie }: MovieBookingModalProps) {

    const todayStr = new Date().toLocaleDateString('en-CA');
    const schedule = movie?.schedule || [];

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCinemaIndex, setSelectedCinemaIndex] = useState("0");
    const [selectedTime, setSelectedTime] = useState<string | null>(null);


    useEffect(() => {
        if (!movie || !open) return;

        const hasToday = schedule.some((s) => s.date === todayStr);
        const defaultDate = hasToday ? todayStr : schedule[0]?.date || '';

        setSelectedDate(defaultDate);
        setSelectedCinemaIndex("0");
        setSelectedTime(null);
    }, [movie, open, todayStr]);

    const currentDaySchedule = schedule.find(s => s.date === selectedDate);

    const availableCinemas = currentDaySchedule?.cinemas || [];

    const currentTimes = availableCinemas[Number(selectedCinemaIndex)]?.times || [];

    const handleDateChange = (newDate: string) => {
        setSelectedDate(newDate);
        setSelectedTime(null);
    };

    const handleCinemaChange = (newIndex: string) => {
        setSelectedCinemaIndex(newIndex);
        setSelectedTime(null);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    if (!movie) return null;


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="flex w-[calc(100vw-1rem)] max-h-[calc(100dvh-1rem)] flex-col overflow-x-hidden overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-0 shadow-2xl sm:w-full sm:max-h-[90vh] sm:rounded-2xl md:w-[min(96vw,72rem)] md:max-w-6xl md:flex-row">

                <div className="relative h-52 w-full shrink-0 md:h-auto md:w-[38%]">
                    <img
                        src={movie.image}
                        className="w-full h-full object-cover"
                        alt={movie.title}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent md:bg-linear-to-r" />
                </div>

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
                    {schedule.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Date Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 uppercase">Date</label>
                                <Select value={selectedDate} onValueChange={handleDateChange}>
                                    <SelectTrigger className="w-full bg-slate-900/50 border-slate-700 text-slate-200 focus:ring-red-500/50 h-12">
                                        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                                            <CalendarDays className="h-4 w-4 shrink-0 text-red-500" />
                                            <SelectValue className="truncate" placeholder="Pick a Date" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                        {schedule.map((day) => (
                                            <SelectItem key={day.date} value={day.date}>
                                                {formatDate(day.date)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Cinema Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 uppercase">Cinema</label>
                                <Select
                                    value={selectedCinemaIndex}
                                    onValueChange={handleCinemaChange}
                                    disabled={availableCinemas.length === 0}
                                >
                                    <SelectTrigger className="w-full bg-slate-900/50 border-slate-700 text-slate-200 focus:ring-red-500/50 h-12">
                                        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
                                            <MapPin className="h-4 w-4 shrink-0 text-red-500" />
                                            <SelectValue className="truncate" placeholder="Select Cinema" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                        {availableCinemas.length > 0 ? (
                                            availableCinemas.map((c, index) => (
                                                <SelectItem key={index} value={String(index)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="0" disabled>No Cinemas Available</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-lg text-red-400 text-center text-sm">
                            No showtimes available currently.
                        </div>
                    )}

                    {/* Time Selection */}
                    {availableCinemas.length > 0 && (
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Available Times
                            </label>

                            <div className="flex flex-wrap gap-3">
                                {currentTimes.length > 0 ? (
                                    currentTimes.map((time, i) => (
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
            </DialogContent>
        </Dialog>
    );
}