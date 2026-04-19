import { describe, expect, it } from 'vitest'
import { validateBackendEnv } from '../lib/env.ts'

describe('backend env validation', () => {
  it('throws with a clear message when required env vars are missing', () => {
    expect(() => validateBackendEnv({})).toThrowError(
      'Missing required backend environment variables: SECRET, DATABASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET',
    )
  })

  it('accepts env objects that include all required vars', () => {
    const env = validateBackendEnv({
      SECRET: 'secret',
      DATABASE_URL: 'postgresql://example',
      CLOUDINARY_CLOUD_NAME: 'cloud',
      CLOUDINARY_API_KEY: 'key',
      CLOUDINARY_API_SECRET: 'api-secret',
      PORT: '3000',
    })

    expect(env.SECRET).toBe('secret')
    expect(env.DATABASE_URL).toBe('postgresql://example')
    expect(env.CLOUDINARY_CLOUD_NAME).toBe('cloud')
    expect(env.CLOUDINARY_API_KEY).toBe('key')
    expect(env.CLOUDINARY_API_SECRET).toBe('api-secret')
    expect(env.PORT).toBe('3000')
  })
})
