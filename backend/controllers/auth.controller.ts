import type { Request, Response } from "express";
import { authService } from "./../services/auth.service.ts";
import { setAuthCookie } from "../utils/http.util.ts";
import type { LoginBody, SessionResponse, SignupBody } from "moviesclub-shared/auth";


type LoginRequest = Request<unknown, unknown, LoginBody>;
type SignupRequest = Request<unknown, unknown, SignupBody>;

export async function login(req: LoginRequest, res: Response<SessionResponse>) {
    const { safeUser, token } = await authService.login(req.body);

    setAuthCookie(res, token);

    res.status(200).json({ user: safeUser });
}

export async function signup(req: SignupRequest, res: Response<SessionResponse>) {
    const { safeUser, token } = await authService.signup(req.body);

    setAuthCookie(res, token);

    res.status(201).json({ user: safeUser });
}

export async function check(req: Request, res: Response<SessionResponse>) {

    const userId = res.locals.userId;
    const safeUser = await authService.checkAuth(userId);

    if (!safeUser) {
        res.clearCookie("jwt");
        return res.status(200).json({ user: null });
    }

    return res.status(200).json({ user: safeUser });
}

export async function logout(req: Request, res: Response<SessionResponse>) {
    res.clearCookie("jwt");
    return res.status(200).json({ user: null });
}