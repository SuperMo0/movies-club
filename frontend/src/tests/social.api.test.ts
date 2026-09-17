import { describe, it, expect } from 'vitest'
import type { GetSignUploadSignutureResponse } from 'moviesclub-shared/api'
import { createCloudinaryFormData } from '@/api/social.api'

describe('createCloudinaryFormData', () => {
    const signData: GetSignUploadSignutureResponse = {
        signature: 'sig123',
        timestamp: 1700000000,
        cloudname: 'demo-cloud',
        apikey: 'key123',
    }
    const file = new File(['binary'], 'avatar.png', { type: 'image/png' })

    it('appends the file and every signature field Cloudinary requires', () => {
        const formData = createCloudinaryFormData(signData, file)
        expect(formData.get('file')).toBe(file)
        expect(formData.get('api_key')).toBe('key123')
        expect(formData.get('timestamp')).toBe('1700000000')
        expect(formData.get('signature')).toBe('sig123')
    })

    it('always uploads to the fixed folder that matches the signed signature', () => {
        const formData = createCloudinaryFormData(signData, file)
        expect(formData.get('folder')).toBe('signed_upload_demo')
    })
})
