import type { Request, Response } from "express";
import { sign, verify } from "../lib/jwt.ts";
import * as authService from "./../services/auth.service.ts"
import { compare, hash } from "../lib/bcrypt.ts";
import type { LoginBody, SessionResponse, SignupBody } from "moviesclub-shared/auth";
import { safeUserResponseSchema } from "moviesclub-shared/auth";
import { appError } from "../errors/appError.ts";


type LoginRequest = Request<unknown, unknown, LoginBody>
export async function login(req: LoginRequest, res: Response<SessionResponse>) {

    const { username, password } = req.body
    const unsafeUser = await authService.getUserByUsername(username);

    if (!unsafeUser) {
        throw new appError(401, "invalid credentials");
    }


    const isPassMatches = await compare(password, unsafeUser.password);

    if (!isPassMatches) {
        throw new appError(401, "invalid credentials");
    }

    await sign(unsafeUser, res);
    const safeUser = safeUserResponseSchema.parse(unsafeUser);
    res.json({ user: safeUser });
}

type SignupReqeust = Request<unknown, unknown, SignupBody>
export async function signup(req: SignupReqeust, res: Response<SessionResponse>) {

    const { password } = req.body;
    const hashedPassword = await hash(password);
    let userHashed = { ...req.body, password: hashedPassword };
    const safeUser = await authService.insertUser(userHashed);
    await sign(safeUser, res);

    res.status(201).json({ user: safeUser });
}

export async function check(req: Request, res: Response<SessionResponse>) {
    try {
        const { jwt } = req.cookies;
        const { userId } = await verify(jwt);
        const safeUser = await authService.getUserById(userId);
        return res.status(200).json({ user: safeUser });
    } catch (error) {
        res.clearCookie("jwt");
        return res.status(401).json({ user: null });
    }
}

export async function logout(req: Request, res: Response<SessionResponse>) {
    res.clearCookie("jwt");
    return res.json({ user: null });
}
