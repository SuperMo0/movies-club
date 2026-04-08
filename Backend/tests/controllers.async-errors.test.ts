import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../app.ts'
import { getUserPosts } from '../controllers/social.controller.ts'

const mocks = vi.hoisted(() => ({
  hash: vi.fn(async () => 'hashed-password'),
  sign: vi.fn(async () => undefined),
  getUserByUsername: vi.fn(),
  insertUser: vi.fn(),
  appStateFindUnique: vi.fn(),
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
      findMany: vi.fn(),
    },
  },
}))

describe('controllers async error flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getUserByUsername.mockResolvedValue(null)
    mocks.insertUser.mockResolvedValue({ id: 'user-1', username: 'alice' })
    mocks.appStateFindUnique.mockResolvedValue({ key: 'moviesData', value: '[]' })
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

  it('routes missing today movies data through error middleware', async () => {
    const app = createApp({ enableNonDevelopmentMiddleware: false })
    mocks.appStateFindUnique.mockResolvedValueOnce(null)

    const response = await request(app).get('/api/movies/today')

    expect(response.status).toBe(503)
    expect(response.body).toEqual({
      message: 'Movies are being fetched, please try again later.',
      error: {
        code: 'MOVIES_DATA_NOT_FOUND',
        message: 'Movies are being fetched, please try again later.',
      },
    })
  })
})
