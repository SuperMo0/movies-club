import type { Request, Response } from "express";
import { sign, verify } from "../lib/jwt.ts";
import * as model from "../Models/auth.model.ts"
import { compare, hash } from "../lib/bcrypt.ts";
import type { AuthUserResponse, ResponseSafeUser } from "moviesclub-shared/auth";
import { LoginSchema, SignupSchema } from "moviesclub-shared/auth";

function sanitizeUser(user: any) {
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword as ResponseSafeUser;
}

function unauthenticatedSession() {
    return { user: null };
}

export async function login(req: Request, res: Response) {
    const parseResult = LoginSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(401).json({ message: "Invalid input" });
    }

    const { username, password } = parseResult.data;

    const user = await model.getUserByUsername(username);

    if (!user) {
        return res.status(401).json({ message: "Wrong credentials" })
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Wrong credentials" })
    }

    await sign(user, res);

    const payload: AuthUserResponse = { user: sanitizeUser(user)! };
    return res.json(payload);
}

export async function signup(req: Request, res: Response) {
    const parseResult = SignupSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(401).json({ message: "Invalid input" });
    }

    const { name, username, password } = parseResult.data;

    const hashedPassword = await hash(password);

    let user;
    try {
        user = await model.insertUser(name, username, hashedPassword);
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
            return res.status(409).json({ message: "Username already exists" });
        }
        throw error
    }

    await sign(user, res);

    const payload: AuthUserResponse = { user: sanitizeUser(user)! };
    return res.status(201).json(payload);
}

export async function check(req: Request, res: Response) {

    try {
        const { jwt } = req.cookies;
        const payload = await verify(jwt);
        const { userId } = payload;
        const user = await model.getUserById(userId);
        return res.status(200).json({ user });
    } catch (error) {
        res.clearCookie("jwt");
        return res.status(200).json(unauthenticatedSession());
    }
}

export async function logout(req: Request, res: Response) {
    res.clearCookie("jwt");
    return res.json({ user: null });
}
