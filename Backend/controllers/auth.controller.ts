import type { Request, Response } from "express";
import { sign, verify } from "../lib/jwt.ts";
import * as model from "../Models/auth.model.ts"
import { compare, hash } from "../lib/bcrypt.ts";
import type { AuthSessionResponse, AuthUserResponse, ResponseSafeUser } from "../../Shared/auth.schema.ts";
import { LoginSchema, SignupSchema } from "../../Shared/auth.schema.ts";
import { AppError } from '../errors/appError.ts'

function sanitizeUser(user: any): ResponseSafeUser | null {
    if (!user) return null;
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword as ResponseSafeUser;
}

function validationError(message: string, details?: unknown) {
    return new AppError({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message,
        publicMessage: 'Validation failed',
        details,
    })
}

export async function login(req: Request, res: Response) {
    const parseResult = LoginSchema.safeParse(req.body);

    if (!parseResult.success) {
        throw validationError(parseResult.error.message, parseResult.error.issues)
    }

    const { username, password } = parseResult.data;

    const user = await model.getUserByUsername(username);

    if (!user) {
        throw new AppError({
            statusCode: 401,
            code: 'AUTH_INVALID_CREDENTIALS',
            message: 'Login attempted with unknown username',
            publicMessage: 'Wrong credentials',
        })
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError({
            statusCode: 401,
            code: 'AUTH_INVALID_CREDENTIALS',
            message: 'Login attempted with invalid password',
            publicMessage: 'Wrong credentials',
        })
    }

    await sign(user, res);

    const payload: AuthUserResponse = { user: sanitizeUser(user)! };
    return res.status(200).json(payload);
}

export async function signup(req: Request, res: Response) {
    const parseResult = SignupSchema.safeParse(req.body);

    if (!parseResult.success) {
        throw validationError(parseResult.error.message, parseResult.error.issues)
    }

    const { name, username, password } = parseResult.data;

    const hashedPassword = await hash(password);

    let user;
    try {
        user = await model.insertUser(name, username, hashedPassword);
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            throw new AppError({
                statusCode: 409,
                code: 'USERNAME_CONFLICT',
                message: 'Username already exists',
                publicMessage: 'Username already exists',
            })
        }

        throw error
    }

    await sign(user, res);

    const payload: AuthUserResponse = { user: sanitizeUser(user)! };
    return res.status(201).json(payload);
}

export async function check(req: Request, res: Response) {
    const { jwt } = req.cookies;

    if (!jwt) {
        const payload: AuthSessionResponse = { user: null };
        return res.status(200).json(payload);
    }

    const userId = await verify(jwt).catch(() => null);

    if (!userId) {
        const payload: AuthSessionResponse = { user: null };
        return res.status(200).json(payload);
    }

    const user = await model.getUserById(userId);

    if (!user) {
        res.clearCookie("jwt");
        const payload: AuthSessionResponse = { user: null };
        return res.status(200).json(payload);
    }

    const payload: AuthSessionResponse = { user: sanitizeUser(user) };
    return res.status(200).json(payload);
}

export async function logout(req: Request, res: Response) {
    res.clearCookie("jwt");
    return res.status(200).json({ message: 'Logged out successfully' });
}
