import { z } from 'zod';

export const createPostBodySchema = z.object({
    content: z.string().min(1, "Content is required"),
    movieTitle: z.string().nullable().optional(),
    rating: z.number().nullable().optional()
}).refine((d) => !(d.rating && !d.movieTitle), { error: "Invalid input found a rating without a movieTitle" });

export const updateProfileBodySchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    bio: z.string().optional().nullable()
});

export const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty")
})

export const IdSchema = z.uuidv4("Invalid id");