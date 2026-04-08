import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { createApp } from '../app.ts'
import { AppError } from '../errors/appError.ts'

function createErrorTestApp() {
  return createApp({
    enableNonDevelopmentMiddleware: false,
    configureApp: app => {
      app.get('/__test__/error/app', () => {
        throw new AppError({
          statusCode: 418,
          code: 'TEAPOT',
          message: 'internal teapot detail',
          publicMessage: 'short and stout',
          details: { hint: 'use a kettle' },
        })
      })

      app.get('/__test__/error/zod', () => {
        z.object({ name: z.string() }).parse({})
      })

      app.get('/__test__/error/prisma-unique', () => {
        const err = Object.assign(new Error('Unique constraint failed on the fields: (username)'), {
          name: 'PrismaClientKnownRequestError',
          code: 'P2002',
          meta: { target: ['username'] },
        })

        throw err
      })

      app.get('/__test__/error/unknown', () => {
        throw new Error('kaboom')
      })

      app.get('/__test__/error/app-internal', () => {
        throw new AppError({
          statusCode: 503,
          code: 'SERVICE_UNAVAILABLE',
          message: 'upstream timeout',
          publicMessage: 'Service temporarily unavailable',
          details: { upstream: 'moviesData', retryAfterMs: 1000 },
        })
      })
    },
  })
}

describe('error middleware', () => {
  it('returns structured 404 response for unmatched api routes', async () => {
    const app = createErrorTestApp()

    const response = await request(app).get('/api/does-not-exist')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      message: 'Route not found',
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    })
  })

  it('passes AppError status code, code and public message through', async () => {
    const app = createErrorTestApp()

    const response = await request(app).get('/__test__/error/app')

    expect(response.status).toBe(418)
    expect(response.body).toEqual({
      message: 'short and stout',
      error: {
        code: 'TEAPOT',
        message: 'short and stout',
        details: { hint: 'use a kettle' },
      },
    })
  })

  it('maps zod validation errors to 400 response payload', async () => {
    const app = createErrorTestApp()

    const response = await request(app).get('/__test__/error/zod')

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
      },
    })
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'name', code: 'invalid_type' }),
      ]),
    )
  })

  it('maps prisma unique constraint errors to 409 response payload', async () => {
    const app = createErrorTestApp()

    const response = await request(app).get('/__test__/error/prisma-unique')

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      message: 'Resource already exists',
      error: {
        code: 'UNIQUE_CONSTRAINT',
        message: 'Resource already exists',
        details: { target: ['username'] },
      },
    })
  })

  it('maps unknown errors to a consistent 500 payload', async () => {
    const app = createErrorTestApp()

    const response = await request(app).get('/__test__/error/unknown')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      message: 'Internal Server Error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
      },
    })
  })

  it('does not expose details for 5xx AppError responses', async () => {
    const app = createErrorTestApp()

    const response = await request(app).get('/__test__/error/app-internal')

    expect(response.status).toBe(503)
    expect(response.body).toEqual({
      message: 'Service temporarily unavailable',
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable',
      },
    })
  })
})
