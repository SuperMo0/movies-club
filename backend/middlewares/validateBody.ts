import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import z from 'zod'

export function validateBody(bodySchema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = bodySchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.json(400).json({ message: "Invalid Input", errors: z.treeifyError(parsedBody.error) })
        }
        req.body = parsedBody.data;
        next();
    }
}