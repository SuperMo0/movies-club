import { z } from 'zod';

export const userIdParamSchema = z.object({
    userId: z.string().min(1, "User ID is required")
});

export const postIdParamSchema = z.object({
    postId: z.string().min(1, "Post ID is required")
});

export const commentBodySchema = z.object({
    content: z.string().min(1, "Content is required")
});

export const createPostBodySchema = z.object({
    content: z.string().min(1, "Content is required"),
    movieId: z.string().nullable().optional().or(z.literal('null')).or(z.literal('')),
    rating: z.string().nullable().optional().or(z.literal('null')).or(z.literal(''))
});

export const updateProfileBodySchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    bio: z.string().optional().nullable()
});
