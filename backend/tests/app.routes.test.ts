import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestApp } from './testApp.ts'

const mocks = vi.hoisted(() => ({
  authCheck: vi.fn((req, res) => res.status(200).json({ route: 'auth-check' })),
  socialLiked: vi.fn((req, res) => res.status(200).json({ route: 'social-liked' })),
  moviesToday: vi.fn((req, res) => res.status(200).json({ route: 'movies-today' })),
  protect: vi.fn((req, res, next) => next()),
}))

vi.mock('../controllers/auth.controller.ts', () => ({
  login: vi.fn((req, res) => res.status(200).json({ route: 'auth-login' })),
  signup: vi.fn((req, res) => res.status(201).json({ route: 'auth-signup' })),
  logout: vi.fn((req, res) => res.status(200).json({ route: 'auth-logout' })),
  check: mocks.authCheck,
}))

vi.mock('../controllers/social.controller.ts', () => ({
  getFeed: vi.fn((req, res) => res.status(200).json({ route: 'feed' })),
  getUsers: vi.fn((req, res) => res.status(200).json({ route: 'users' })),
  getUserPosts: vi.fn((req, res) => res.status(200).json({ route: 'posts' })),
  getUserLikedPosts: mocks.socialLiked,
  likePost: vi.fn((req, res) => res.status(200).json({ route: 'like' })),
  deleteLikePost: vi.fn((req, res) => res.status(200).json({ route: 'delete-like' })),
  commentPost: vi.fn((req, res) => res.status(200).json({ route: 'comment' })),
  createPost: vi.fn((req, res) => res.status(201).json({ route: 'create-post' })),
  updateProfile: vi.fn((req, res) => res.status(200).json({ route: 'update-profile' })),
}))

vi.mock('../controllers/movies.controller.ts', () => ({
  getAllMovies: vi.fn((req, res) => res.status(200).json({ route: 'movies-all' })),
  getTodayMovies: mocks.moviesToday,
}))

vi.mock('../middlewares/protect.ts', () => ({ default: mocks.protect }))

describe('backend test app routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('routes auth check requests to auth controller', async () => {
    const app = createTestApp()

    const response = await request(app).get('/api/auth/check')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ route: 'auth-check' })
    expect(mocks.authCheck).toHaveBeenCalledTimes(1)
  })

  it('applies protect middleware before protected social routes', async () => {
    const app = createTestApp()

    const response = await request(app).get('/api/social/liked')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ route: 'social-liked' })
    expect(mocks.protect).toHaveBeenCalledTimes(1)
    expect(mocks.socialLiked).toHaveBeenCalledTimes(1)
    const protectCallOrder = mocks.protect.mock.invocationCallOrder[0]
    const socialLikedCallOrder = mocks.socialLiked.mock.invocationCallOrder[0]

    expect(protectCallOrder).toBeDefined()
    expect(socialLikedCallOrder).toBeDefined()

    if (protectCallOrder === undefined || socialLikedCallOrder === undefined) {
      throw new Error('Expected protect and social-liked handlers to be called')
    }

    expect(protectCallOrder).toBeLessThan(socialLikedCallOrder)
  })

  it('sets movie cache header and routes to movies today controller', async () => {
    const app = createTestApp()

    const response = await request(app).get('/api/movies/today')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ route: 'movies-today' })
    expect(response.headers['cache-control']).toMatch(/public, max-age=\d+/)
    expect(mocks.moviesToday).toHaveBeenCalledTimes(1)
  })
})
