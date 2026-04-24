import client from '@/lib/axios'
import { catchAsync } from '@/utils/catch-async';
import type { Movie } from "moviesclub-shared/movies"

type TodayMoviesResponse = {
    movies: Movie[];
}

export async function fetchTodayMovies() {
    let [error, data] = await catchAsync(client.get<TodayMoviesResponse>('/movies/today'));
    if (error) throw error;
    return data?.movies
}