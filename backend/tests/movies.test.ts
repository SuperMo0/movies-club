import { vi, describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.ts'

vi.mock('../lib/prisma.ts', () => ({
  prisma: {
    app_state: {
      findUnique: vi.fn()
    }
  }
}))

import { prisma } from '../lib/prisma.ts'

const app = createApp({ enableNonDevelopmentMiddleware: false })

describe('Movies API', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('GET /api/movies returns 503 when data is not yet available', async () => {
    vi.mocked(prisma.app_state.findUnique).mockResolvedValue(null)
    const res = await request(app).get('/api/movies')
    expect(res.status).toBe(503)
    expect(res.body).toMatchObject({ message: 'Movies are being fetched, please try again later.' })
  })

  it('GET /api/movies returns movies when data is available', async () => {
    vi.mocked(prisma.app_state.findUnique).mockResolvedValue({
      value: JSON.stringify([{ id: 1, title: 'Test Movie' }])
    } as any)
    const res = await request(app).get('/api/movies')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('movies')
    expect(Array.isArray(res.body.movies)).toBe(true)
  })

  it('GET /api/movies/cinemas returns 503 when data is not yet available', async () => {
    vi.mocked(prisma.app_state.findUnique).mockResolvedValue(null)
    const res = await request(app).get('/api/movies/cinemas')
    expect(res.status).toBe(503)
    expect(res.body).toMatchObject({ message: 'Movies are being fetched, please try again later.' })
  })
})
