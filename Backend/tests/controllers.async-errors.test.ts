import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../app.ts'
import { getUserPosts } from '../controllers/social.controller.ts'

const mocks = vi.hoisted(() => ({
  hash: vi.fn(async () => 'hashed-password'),
  sign: vi.fn(async () => undefined),
  getUserByUsername: vi.fn(),
  insertUser: vi.fn(),
  appStateFindUnique: vi.fn(),
  movieFindMany: vi.fn(),
}))

vi.mock('../lib/bcrypt.ts', () => ({
  compare: vi.fn(async () => true),
  hash: mocks.hash,
}))

vi.mock('../lib/jwt.ts', () => ({
  sign: mocks.sign,
  verify: vi.fn(),
}))

vi.mock('../Models/auth.model.ts', () => ({
  userProfileSelect: { id: true },
  getUserByUsername: mocks.getUserByUsername,
  getUserById: vi.fn(),
  insertUser: mocks.insertUser,
}))

vi.mock('../lib/prisma.ts', () => ({
  prisma: {
    app_state: {
      findUnique: mocks.appStateFindUnique,
    },
    movie: {
      findMany: mocks.movieFindMany,
    },
  },
}))

describe('controllers async error flow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    vi.clearAllMocks()
    mocks.getUserByUsername.mockResolvedValue(null)
    mocks.insertUser.mockResolvedValue({ id: 'user-1', username: 'alice' })
    mocks.appStateFindUnique.mockResolvedValue({ key: 'moviesData', value: '[]' })
    mocks.movieFindMany.mockResolvedValue([])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('routes auth login validation failures through error middleware', async () => {
    const app = createApp({ enableNonDevelopmentMiddleware: false })

    const response = await request(app).post('/api/auth/login').send({ username: '' })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: {
        code: 'VALIDATION_ERROR',
      },
    })
  })

  it('routes signup conflicts through error middleware', async () => {
    const app = createApp({ enableNonDevelopmentMiddleware: false })
    mocks.insertUser.mockRejectedValueOnce(
      Object.assign(new Error('Unique constraint failed on the fields: (`username`)'), {
        name: 'PrismaClientKnownRequestError',
        code: 'P2002',
      }),
    )

    const response = await request(app).post('/api/auth/signup').send({
      name: 'Alice',
      username: 'alice',
      password: 'passw0rd',
    })

    expect(response.status).toBe(409)
    expect(response.body).toMatchObject({
      error: {
        code: 'USERNAME_CONFLICT',
        message: 'Username already exists',
      },
    })
  })

  it('social handlers throw AppError for validation failures', async () => {
    const req = { params: {} } as any
    const res = {} as any

    await expect(getUserPosts(req, res)).rejects.toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    })
  })

  it('falls back to persisted movies when today cache is missing', async () => {
    const app = createApp({ enableNonDevelopmentMiddleware: false })
    mocks.appStateFindUnique.mockResolvedValueOnce(null)
    mocks.movieFindMany.mockResolvedValueOnce([{ id: 'movie-1', title: 'Fallback Movie' }])

    const response = await request(app).get('/api/movies/today')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      movies: [{ id: 'movie-1', title: 'Fallback Movie' }],
    })
    expect(mocks.movieFindMany).toHaveBeenCalledTimes(1)
  })

  it('falls back to persisted movies when today cache payload is malformed', async () => {
    const app = createApp({ enableNonDevelopmentMiddleware: false })
    vi.setSystemTime(new Date('2026-01-02T00:00:00.000Z'))
    mocks.appStateFindUnique.mockResolvedValueOnce({ key: 'moviesData', value: '{not-json' })
    mocks.movieFindMany.mockResolvedValueOnce([{ id: 'movie-2', title: 'Recovered Movie' }])

    const response = await request(app).get('/api/movies/today')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      movies: [{ id: 'movie-2', title: 'Recovered Movie' }],
    })
    expect(mocks.movieFindMany).toHaveBeenCalledTimes(1)
  })
})
