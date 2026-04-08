import type { Request, Response } from 'express'
import { prisma } from './../lib/prisma.ts'
import { AppError } from '../errors/appError.ts'

let cachedMovies: any = null;
let lastUpdate: string | null = null;

export async function getTodayMovies(req: Request, res: Response) {
    const today = new Date().toLocaleDateString('en-CA');

    if (cachedMovies && lastUpdate === today) {
        return res.json({ movies: cachedMovies });
    }

    const record = await prisma.app_state.findUnique({ where: { key: 'moviesData' } });

    if (!record) {
        throw new AppError({
            statusCode: 503,
            code: 'MOVIES_DATA_NOT_FOUND',
            message: 'Movies data was not found in app_state',
            publicMessage: 'Movies are being fetched, please try again later.',
        })
    }

    const parsedData = JSON.parse(record.value);

    cachedMovies = parsedData;
    lastUpdate = today;

    return res.json({ movies: cachedMovies });
}

export async function getAllMovies(req: Request, res: Response) {
    const movies = await prisma.movie.findMany({
        include: {
            genres: true,
        }
    })
    return res.json({ movies })
}
