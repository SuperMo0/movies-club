import client from '@/lib/axios'
import { catchAsync } from '@/utils/catch-async';
import type { TodayMoviesResponse, TodayCinemasResponse } from 'moviesclub-shared/api';


export async function GETTodayMovies() {
    const [error, data] = await catchAsync(client.get<TodayMoviesResponse>('/movies'));
    if (error) throw error;
    return data;
}

export async function GETTodayCinemas() {
    const [error, data] = await catchAsync(client.get<TodayCinemasResponse>('/movies/cinemas'));
    if (error) throw error;
    return data;
}