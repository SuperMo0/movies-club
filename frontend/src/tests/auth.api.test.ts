import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/axios', () => ({
    default: { get: vi.fn(), post: vi.fn() },
}))

import client from '@/lib/axios'
import { checkSession, login, signup, logout } from '@/api/auth.api'

beforeEach(() => {
    vi.resetAllMocks()
})

describe('checkSession', () => {
    it('returns the session data on success', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(client.get).mockResolvedValueOnce({ data: { user: { id: '1' } } } as any)
        const result = await checkSession()
        expect(result).toEqual({ user: { id: '1' } })
    })

    it('treats a 401 as a logged-out session instead of throwing', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(client.get).mockRejectedValueOnce({ status: 401 } as any)
        const result = await checkSession()
        expect(result).toEqual({ user: null })
    })

    it('rethrows any error that is not a 401, instead of silently logging the user out', async () => {
        const error = { status: 500, message: 'server error' }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(client.get).mockRejectedValueOnce(error as any)
        await expect(checkSession()).rejects.toEqual(error)
    })
})

describe('login', () => {
    it('returns session data and posts the exact credentials given', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(client.post).mockResolvedValueOnce({ data: { user: { id: '1' } } } as any)
        const result = await login({ username: 'a', password: 'b' })
        expect(result).toEqual({ user: { id: '1' } })
        expect(client.post).toHaveBeenCalledWith('/auth/login', { username: 'a', password: 'b' })
    })

    it('throws on invalid credentials instead of returning a falsy session', async () => {
        const error = { status: 401, message: 'Invalid credentials' }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(client.post).mockRejectedValueOnce(error as any)
        await expect(login({ username: 'a', password: 'wrong' })).rejects.toEqual(error)
    })
})

describe('signup', () => {
    it('throws when the server rejects signup (e.g. username already taken)', async () => {
        const error = { status: 409, message: 'Username taken' }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(client.post).mockRejectedValueOnce(error as any)
        await expect(signup({ name: 'a', username: 'a', password: 'b' })).rejects.toEqual(error)
    })
})

describe('logout', () => {
    it('throws when logout fails server-side instead of pretending the session ended', async () => {
        const error = { status: 500 }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.mocked(client.post).mockRejectedValueOnce(error as any)
        await expect(logout()).rejects.toEqual(error)
    })
})
