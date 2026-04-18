import { z } from 'zod';

export const createPostBodySchema = z.object({
    content: z.string().min(1, "Content is required"),
    movieTitle: z.string().nullable(),
    rating: z.number().nullable(),
    image: z.file().optional(),
}).refine((d) => !(d.rating && !d.movieTitle), { error: "Invalid input found a rating without a movieTitle" });

export const updateProfileBodySchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    bio: z.string().optional().nullable()
});

export const createCommentBodySchema = z.object({
    content: z.string().min(1, "Comment cannot be empty")
})

export const IdSchema = z.uuidv4("Invalid id");


export const commentSchema = z.object({
    id: z.uuidv4(),
    content: z.string(),
    authorId: z.uuidv4(),
    createdAt: z.string(),
    postId: z.uuidv4()
});

export const postSchema = z.object({
    id: z.uuidv4(),
    content: z.string(),
    movieTitle: z.string().nullish().optional(),
    rating: z.number().nullish().optional(),
    image: z.url().nullish().nullable(),
    authorId: z.uuidv4(),
    createdAt: z.string(),
    _count: z.object({
        likedBy: z.number()
    }),
    comments: z.array(commentSchema)
});

export type Post = z.infer<typeof postSchema>
export type Comment = z.infer<typeof commentSchema>
export type createCommentBody = z.infer<typeof createCommentBodySchema>
export type createPostBody = z.infer<typeof createPostBodySchema>