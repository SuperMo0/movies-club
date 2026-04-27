import { z } from 'zod';
import { safeUserResponseSchema } from './auth.schema.ts'


// comment schemas
export const createCommentBodySchema = z.object({
    content: z.string().min(1, "Comment cannot be empty")
})


export const commentSchema = z.object({
    id: z.uuidv4(),
    content: z.string(),
    authorId: z.uuidv4(),
    createdAt: z.string(),
    postId: z.uuidv4(),
    author: safeUserResponseSchema
});

// post schemas
export const postSchema = z.object({
    id: z.uuidv4(),
    content: z.string(),
    movieTitle: z.string().nullish().optional(),
    rating: z.coerce.number().nullish().optional(),
    image: z.url().nullish().nullable(),
    authorId: z.uuidv4(),
    createdAt: z.string(),
    _count: z.object({
        likedBy: z.number()
    }),
    comments: z.array(commentSchema),
    author: safeUserResponseSchema
});

export const createPostBodyClientSchema = z.object({
    content: z.string().min(1, "Content is required"),
    movieTitle: z.string().nullish().optional(),
    rating: z.number().nullish().optional(),
    image: z.file().optional().nullable().refine((f) => {
        return !f || (f.type.startsWith('image'))
    })
}).refine((d) => !(d.rating && !d.movieTitle), { error: "Invalid input found a rating without a movieTitle" });

export const createPostBodyServerSchema = z.object({
    content: z.string().min(1, "Content is required"),
    movieTitle: z.string().nullable().optional(),
    rating: z.coerce.number().nullish().optional(),
    image: z.url().optional().nullable()

}).refine((d) => !(d.rating && !d.movieTitle), { error: "Invalid input found a rating without a movieTitle" });

// user Profile Data schema 

export const userProfileData = safeUserResponseSchema.extend({ posts: z.array(postSchema) })

// update profile schemas
export const updateProfileBodyBaseSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    bio: z.string().optional().nullable()
});

export const updateProfileBodyClientSchema = updateProfileBodyBaseSchema.extend({
    image: z.file().nullable().optional().refine((f) => {
        return !f || (f.type.startsWith('image'))
    })
})

export const updateProfileBodyServerSchema = updateProfileBodyBaseSchema.extend({
    image: z.url().nullable().optional()
})


export type Post = z.infer<typeof postSchema>
export type Comment = z.infer<typeof commentSchema>
export type CreateCommentBody = z.infer<typeof createCommentBodySchema>
export type CreatePostBodyClient = z.infer<typeof createPostBodyClientSchema>
export type CreatePostBodyServer = z.infer<typeof createPostBodyServerSchema>
export type UpdateProfileBodyClient = z.infer<typeof updateProfileBodyClientSchema>
export type UpdateProfileBodyServer = z.infer<typeof updateProfileBodyServerSchema>
export type UserProfileData = z.infer<typeof userProfileData>