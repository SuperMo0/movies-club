import { z } from 'zod';


export const signupBodySchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters long"),
    username: z.string()
        .min(2, "Username must be at least 2 characters long")
        .max(20, "Username cannot exceed 20 characters"),
    password: z.string()
        .min(3, "Password must be at least 3 characters long"),
});


export const loginBodySchema = z.object({
    username: z.string()
        .min(2, "Username is required"),
    password: z.string()
        .min(3, "Password is required"),
});


export const safeUserResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    image: z.url()
        .nullish(),
    bio: z.string()
        .nullish(),
    joinedAt: z.date(),
    _count: z.object({
        followedBy: z.number(),
        following: z.number(),
    })
})

export const sessionResponseSchema = z.object({
    user: safeUserResponseSchema.nullable(),
})

export type SafeUserResponse = z.infer<typeof safeUserResponseSchema>
export type SignupBody = z.infer<typeof signupBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>


