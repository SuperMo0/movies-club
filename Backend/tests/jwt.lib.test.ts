import type { Response } from 'express'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_SECRET = process.env.SECRET
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

beforeEach(() => {
  vi.resetModules()
  process.env.SECRET = 'test-secret'
  process.env.NODE_ENV = 'test'
})

afterAll(() => {
  process.env.SECRET = ORIGINAL_SECRET
})

describe('jwt helper', () => {
  it('does not require jsonwebtoken to load', async () => {
    vi.doMock('jsonwebtoken', () => {
      throw new Error('jsonwebtoken should not be loaded')
    })

    try {
      await expect(import('../lib/jwt.ts')).resolves.toMatchObject({
        sign: expect.any(Function),
        verify: expect.any(Function),
      })
    } finally {
      vi.doUnmock('jsonwebtoken')
      vi.resetModules()
    }
  })

  it('signs token, sets jwt cookie, and verify returns same user id', async () => {
    const { sign, verify } = await import('../lib/jwt.ts')
    const cookie = vi.fn()
    const res = { cookie } as unknown as Response

    const token = await sign({ id: 'user-123' }, res)

    expect(typeof token).toBe('string')
    expect(cookie).toHaveBeenCalledTimes(1)
    expect(cookie).toHaveBeenCalledWith(
      'jwt',
      token,
      expect.objectContaining({
        maxAge: THIRTY_DAYS_MS,
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      }),
    )

    await expect(verify(token)).resolves.toBe('user-123')
  })

  it('rejects when token is missing', async () => {
    const { verify } = await import('../lib/jwt.ts')
    await expect(verify(undefined)).rejects.toThrow('No token provided')
  })

  it('rejects invalid token', async () => {
    const { verify } = await import('../lib/jwt.ts')
    await expect(verify('not-a-valid-token')).rejects.toThrow()
  })
})
