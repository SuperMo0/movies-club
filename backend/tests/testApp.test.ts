import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.ts'

const app = createApp({ enableNonDevelopmentMiddleware: false })

describe('API', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route')
    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({ message: 'Route not found' })
  })

  it('returns 401 when accessing a protected route without auth', async () => {
    const res = await request(app).get('/api/auth/check')
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({ message: 'Unauthorized' })
  })
})
