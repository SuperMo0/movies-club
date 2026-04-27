import type { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import z from 'zod';

export function validateParams(paramBodySchema: ZodType) {

    type ParamsBody = z.infer<typeof paramBodySchema>
    return (req: Request<ParamsBody>, res: Response, next: NextFunction) => {
        const parseResult = paramBodySchema.safeParse(req.params);
        if (!parseResult.success) {
            return res.status(400).json({ message: "Invalid params", errors: z.treeifyError(parseResult.error) });
        }
        req.params = parseResult.data;
        next();
    }


}