import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createTestApp } from './testApp.ts'

describe('protect middleware integration', () => {
  it('returns structured 401 error for protected route when token is missing', async () => {
    const app = createTestApp()

    const response = await request(app).get('/api/social/liked')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      message: 'Unauthorized',
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Unauthorized',
      },
    })
  })
})
