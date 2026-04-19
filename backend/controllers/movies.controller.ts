import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.ts'
import { getSecondsUntil3AM } from '../utils/cache.ts';

let cachedMovies: any[] = []
let lastUpdate: string | null = null


export async function getTodayMovies(req: Request, res: Response) {
  const today = new Date().toLocaleDateString('en-CA');
  if (cachedMovies && lastUpdate === today) {
    return res.json({ movies: cachedMovies });
  }

  const record = await prisma.app_state.findUnique({ where: { key: 'moviesData' } });

  if (!record) {
    return res.status(503).json({ message: "Movies are being fetched, please try again later." });
  }

  let parsedData = JSON.parse(record.value) as any[];

  //temporary fix we have to check why movies are being duplicated
  cachedMovies = []
  const mp = new Map();
  for (const m of parsedData) {
    if (mp.has(m.id)) continue;
    mp.set(m.id, true);
    cachedMovies.push(m);
  }

  lastUpdate = today;

  res.set('Cache-Control', `public, max-age=${Math.min(getSecondsUntil3AM(), 60 * 60)}`);
  res.json({ movies: cachedMovies });
}
