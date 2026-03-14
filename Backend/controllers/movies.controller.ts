import type { Request, Response, NextFunction } from 'express'
import { prisma } from './../lib/prisma.js'

let cachedMovies: any = null;
let lastUpdate: string | null = null;

export async function getTodayMovies(req: Request, res: Response, next: NextFunction) {
    try {

        const today = new Date().toLocaleDateString('en-CA');

        if (cachedMovies && lastUpdate === today) {
            return res.json({ movies: cachedMovies });
        }

        const record = await prisma.app_state.findUnique({ where: { key: 'moviesData' } });

        if (!record) {
            return res.status(503).json({ message: "Movies are being fetched, please try again later." });
        }

        let parsedData = JSON.parse(record.value);

        cachedMovies = parsedData;
        lastUpdate = today;

        res.json({ movies: cachedMovies });

    } catch (error) {
        console.log("Error reading movies file:", error);
        next(error);
    }
}

export async function getAllMovies(req: Request, res: Response, next: NextFunction) {
    try {
        let movies = await prisma.movie.findMany({
            include: {
                genres: true,
            }
        })
        res.json({ movies })
    } catch (error) {
        console.log("Error getting movies", error);
        next(error);
    }
}