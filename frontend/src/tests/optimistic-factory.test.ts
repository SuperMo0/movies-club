import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { SessionResponse } from 'moviesclub-shared/auth'
import type { Post } from 'moviesclub-shared/social'
import { queryClient } from '@/utils/query-client'
import { createComment, createPost } from '@/utils/optimistic-factory'

const authUser: NonNullable<SessionResponse['user']> = {
    id: 'user-1',
    name: 'Test User',
    username: 'testuser',
    image: null,
    bio: null,
    joinedAt: new Date('2024-01-01'),
    _count: { followedBy: 0, following: 0 },
}

const post = { id: 'post-1' } as Post

beforeEach(() => {
    queryClient.clear()
})

describe('createComment', () => {
    it('throws instead of building a comment when there is no active session', () => {
        expect(() => createComment({ content: 'hi' }, post)).toThrow(/no session/i)
    })

    it('builds the optimistic comment from the active session user, not caller-supplied data', () => {
        queryClient.setQueryData<SessionResponse>(['session'], { user: authUser })

        const comment = createComment({ content: 'Great movie!' }, post)

        expect(comment.content).toBe('Great movie!')
        expect(comment.author).toBe(authUser)
        expect(comment.authorId).toBe(authUser.id)
        expect(comment.postId).toBe(post.id)
        expect(comment.id).toMatch(/^[0-9a-f-]{36}$/i)
    })
})

describe('createPost', () => {
    it('throws instead of building a post when there is no active session', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => createPost({ content: 'hi' } as any)).toThrow(/no session/i)
    })

    it('creates a local object URL preview when an image is provided', () => {
        queryClient.setQueryData<SessionResponse>(['session'], { user: authUser })
        const createObjectURL = vi.fn(() => 'blob:mock-preview')
        vi.stubGlobal('URL', { ...URL, createObjectURL })
        const file = new File(['data'], 'poster.png', { type: 'image/png' })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const optimisticPost = createPost({ content: 'loved it', image: file } as any)

        expect(createObjectURL).toHaveBeenCalledWith(file)
        expect(optimisticPost.image).toBe('blob:mock-preview')

        vi.unstubAllGlobals()
    })

    it('leaves image undefined and zero-initializes derived fields when no image is provided', () => {
        queryClient.setQueryData<SessionResponse>(['session'], { user: authUser })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const optimisticPost = createPost({ content: 'no poster here' } as any)

        expect(optimisticPost.image).toBeUndefined()
        expect(optimisticPost.comments).toEqual([])
        expect(optimisticPost._count).toEqual({ likedBy: 0 })
        expect(optimisticPost.authorId).toBe(authUser.id)
    })
})
