import { describe, expect, it, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  postCreate: vi.fn(),
  userUpdate: vi.fn(),
  uploadStream: vi.fn(),
}))

vi.mock('../lib/prisma.ts', () => ({
  prisma: {
    post: {
      create: mocks.postCreate,
    },
    user: {
      update: mocks.userUpdate,
    },
  },
}))

vi.mock('../lib/cloudinary.ts', () => ({
  default: {
    uploader: {
      upload_stream: mocks.uploadStream,
    },
  },
}))

vi.mock('../Models/auth.model.ts', () => ({
  userProfileSelect: { id: true },
}))

import { createPost, updateProfile } from '../controllers/social.controller.ts'

describe('social controller error mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps createPost upload failures to a dedicated AppError', async () => {
    mocks.uploadStream.mockImplementation((_options, callback) => {
      return {
        end: () => callback(new Error('cloudinary unavailable'), undefined),
      }
    })

    const req = {
      userId: 'user-1',
      file: { buffer: Buffer.from('img') },
      body: { content: 'hello', movieId: '', rating: '' },
    } as any

    const res = {} as any

    await expect(createPost(req, res)).rejects.toMatchObject({
      statusCode: 500,
      code: 'IMAGE_UPLOAD_FAILED',
      message: 'Error uploading image',
    })
  })

  it('maps updateProfile Prisma P2025 to USER_NOT_FOUND AppError', async () => {
    mocks.userUpdate.mockRejectedValueOnce(
      Object.assign(new Error('Record to update not found.'), {
        code: 'P2025',
      }),
    )

    const req = {
      userId: 'missing-user',
      body: { name: 'Alice', bio: 'Hello' },
    } as any

    const res = {} as any

    await expect(updateProfile(req, res)).rejects.toMatchObject({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
      message: 'User missing-user not found while updating profile',
      publicMessage: 'User not found',
    })
  })
})
