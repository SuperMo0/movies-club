import { z } from 'zod';

export const SignupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username cannot exceed 20 characters"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const LoginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export type ResponseSafeUser = {
    id: string;
    name: string;
    username: string;
    image: string | null;
    bio: string | null;
    joinedAt: Date | string;
};

export type AuthUserResponse = {
    user: ResponseSafeUser;
};

export type AuthSessionResponse = {
    user: ResponseSafeUser | null;
};


export type SignupType = z.infer<typeof SignupSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
