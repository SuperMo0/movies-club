import { describe, it, expect } from 'vitest'
import type { AxiosResponse } from 'axios'
import { AxiosError } from 'axios'
import { catchAsync } from '@/utils/catch-async'

describe('catchAsync', () => {
    it('returns [null, data] when the promise resolves', async () => {
        const response = { data: { ok: true } } as AxiosResponse<{ ok: boolean }>
        const [error, data] = await catchAsync(Promise.resolve(response))
        expect(error).toBeNull()
        expect(data).toEqual({ ok: true })
    })

    it('returns [error, null] when the promise rejects with an AxiosError', async () => {
        const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST')
        const [error, data] = await catchAsync(Promise.reject(axiosError))
        expect(data).toBeNull()
        expect(error).toBe(axiosError)
    })

    it('never throws, even when the promise rejects', async () => {
        await expect(catchAsync(Promise.reject(new Error('boom')))).resolves.toBeDefined()
    })

    it('passes non-Axios rejection reasons through unchanged instead of swallowing them', async () => {
        const genericError = new TypeError('boom')
        const [error] = await catchAsync(Promise.reject(genericError))
        expect(error).toBe(genericError)
    })
})
