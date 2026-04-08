import type { Request, Response } from 'express'
import { prisma } from './../lib/prisma.ts'

let cachedMovies: any = null
let lastUpdate: string | null = null

async function getFallbackMovies() {
  return prisma.movie.findMany({
    include: {
      genres: true,
    },
  })
}

export async function getTodayMovies(req: Request, res: Response) {
  const today = new Date().toLocaleDateString('en-CA')
  if (cachedMovies && lastUpdate === today) {
    return res.json({ movies: cachedMovies })
  }

  const record = await prisma.app_state.findUnique({ where: { key: 'moviesData' } })

  if (!record) {
    cachedMovies = await getFallbackMovies()
    lastUpdate = today
    return res.json({ movies: cachedMovies })
  }

  try {
    cachedMovies = JSON.parse(record.value)
  } catch {
    cachedMovies = await getFallbackMovies()
  }

  lastUpdate = today
  return res.json({ movies: cachedMovies })
}

export async function getAllMovies(req: Request, res: Response) {
  const movies = await prisma.movie.findMany({
    include: {
      genres: true,
    },
  })
  return res.json({ movies })
}
