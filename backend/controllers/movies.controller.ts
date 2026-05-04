import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.ts'
import { getSecondsUntil3AM } from '../utils/timeTillCron.util.ts';
import type { Movie, todayCinemasRecord } from 'moviesclub-shared/movies';
import { appError } from '../errors/appError.ts';
import type { TodayCinemasResponse, TodayMoviesResponse } from 'moviesclub-shared/api';

let cachedMoviesData: Movie[]
let lastUpdateMoviesData: string | null = null

export async function getTodayMovies(req: Request, res: Response<TodayMoviesResponse>) {
  const today = new Date().toLocaleDateString('en-CA');

  if (cachedMoviesData && lastUpdateMoviesData === today) {
    return res.json({ movies: cachedMoviesData });
  }
  const record = await prisma.app_state.findUnique({ where: { key: 'moviesData' } });
  if (!record) {
    throw new appError(503, "Movies are being fetched, please try again later.");
  }
  const data = JSON.parse(record.value);

  cachedMoviesData = data;
  lastUpdateMoviesData = today;

  res.set('Cache-Control', `public, max-age=${Math.min(getSecondsUntil3AM(), 60 * 60)}`);
  res.json({ movies: cachedMoviesData });
}


let cachedCinemasData: todayCinemasRecord
let lastUpdateCinemasData: string | null = null
export async function getCinemas(req: Request, res: Response<TodayCinemasResponse>) {
  const today = new Date().toLocaleDateString("en-CA");

  if (cachedCinemasData && lastUpdateCinemasData === today) {
    return res.json({ cinemas: cachedCinemasData });
  }
  const record = await prisma.app_state.findUnique({ where: { key: 'cinemasData' } });
  if (!record) {
    throw new appError(503, "Movies are being fetched, please try again later.");
  }
  cachedCinemasData = JSON.parse(record.value);
  lastUpdateCinemasData = today;

  res.set('Cache-Control', `public, max-age=${Math.min(getSecondsUntil3AM(), 60 * 60)}`);
  res.json({ cinemas: cachedCinemasData });

}
