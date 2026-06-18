import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.ts'

const app = createApp({ enableNonDevelopmentMiddleware: false })

describe('Social API', () => {
  describe('protected routes require authentication', () => {
    it('GET /api/social/liked → 401', async () => {
      const res = await request(app).get('/api/social/liked')
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({ message: 'Unauthorized' })
    })

    it('GET /api/social/follows → 401', async () => {
      const res = await request(app).get('/api/social/follows')
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({ message: 'Unauthorized' })
    })

    it('POST /api/social/post → 401', async () => {
      const res = await request(app).post('/api/social/post').send({})
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({ message: 'Unauthorized' })
    })

    it('PUT /api/social/profile → 401', async () => {
      const res = await request(app).put('/api/social/profile').send({})
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({ message: 'Unauthorized' })
    })

    it('DELETE /api/social/like/:postId → 401', async () => {
      const res = await request(app).delete('/api/social/like/00000000-0000-4000-8000-000000000000')
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({ message: 'Unauthorized' })
    })
  })

  describe('param validation', () => {
    it('GET /api/social/users/:username returns 400 for username shorter than 3 chars', async () => {
      const res = await request(app).get('/api/social/users/ab')
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ message: 'Invalid params' })
    })
  })
})
