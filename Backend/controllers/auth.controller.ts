import type { Request, Response } from "express";
import { sign, verify } from "../lib/jwt.js";
import * as model from "../Models/auth.model.js"
import { compare, hash } from "../lib/bcrypt.js";
import { LoginSchema, SignupSchema } from "../../Shared/auth.schema.ts";
function sanitizeUser(user: any) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function login(req: Request, res: Response) {

    try {
        const parseResult = LoginSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({ message: parseResult.error.message });
        }

        const { username, password } = parseResult.data;

        const user = await model.getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: "Wrong credentials" });
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Wrong credentials" });
        }

        await sign(user, res);

        return res.status(200).json({ user: sanitizeUser(user) });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function signup(req: Request, res: Response) {
    try {
        const parseResult = SignupSchema.safeParse(req.body);

        if (!parseResult.success) {
            return res.status(400).json({ message: parseResult.error.message });
        }

        let { name, username, password } = parseResult.data;

        const hashedPassword = await hash(password);

        const user = await model.insertUser(name, username, hashedPassword);

        await sign(user, res);

        return res.status(201).json({ user: sanitizeUser(user) });

    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "Username already exists" });
        }

        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function check(req: Request, res: Response) {
    try {
        const { jwt } = req.cookies;

        if (!jwt) {
            return res.status(200).json({ user: null });
        }


        let userId = await verify(jwt);

        if (!userId) {
            return res.status(200).json({ user: null });
        }


        let user = await model.getUserById(userId);

        if (!user) {
            res.clearCookie("jwt");
            return res.status(200).json({ user: null });
        }

        return res.status(200).json({ user: sanitizeUser(user) });

    } catch (error) {
        return res.status(200).json({ user: null });
    }
}

export async function logout(req: Request, res: Response) {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Error during logout" });
    }
}