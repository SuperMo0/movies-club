import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.ts'

const app = createApp({ enableNonDevelopmentMiddleware: false })

describe('Auth API', () => {
  it('POST /api/auth/logout requires authentication', async () => {
    const res = await request(app).post('/api/auth/logout')
    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({ message: 'Unauthorized' })
  })

  it('POST /api/auth/login with invalid body returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({ message: 'Invalid Input' })
  })

  it('POST /api/auth/signup with invalid body returns 400', async () => {
    const res = await request(app).post('/api/auth/signup').send({})
    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({ message: 'Invalid Input' })
  })
})
