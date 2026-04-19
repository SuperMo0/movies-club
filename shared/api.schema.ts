import { z } from 'zod';

export const ApiErrorResponseSchema = z.object({
  message: z.string(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
