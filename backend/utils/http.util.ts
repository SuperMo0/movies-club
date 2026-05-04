import type { Request, Response } from "express";

export const setAuthCookie = (res: Response, token: string) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000
    });
};