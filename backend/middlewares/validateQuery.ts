import type { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import z from 'zod';

// Express 5 makes req.query read-only, so the parsed query is stored on res.locals.query.
export function validateQuery(querySchema: ZodType) {

    return (req: Request, res: Response, next: NextFunction) => {
        const parseResult = querySchema.safeParse(req.query);
        if (!parseResult.success) {
            return res.status(400).json({ message: "Invalid query", errors: z.treeifyError(parseResult.error) });
        }
        res.locals.query = parseResult.data;
        next();
    }
}
