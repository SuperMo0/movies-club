import z from 'zod';

export const cinemaEntrySchema = z.record(z.string(), z.record(z.string(), z.array(z.string())));

export const todayCinemasRecordScehma = z.record(z.string(), cinemaEntrySchema);

export const dayEntrySchema = z.object({
    date: z.string(),
    cinemas: z.array(z.object({ name: z.string(), times: z.array(z.string()) }))
})

export const movieSchema = z.object({
    id: z.string(),
    title: z.string(),
    image: z.url(),
    description: z.string(),
    genre: z.array(z.string()),
    schedule: z.array(dayEntrySchema).optional()
})


export type Movie = z.infer<typeof movieSchema>
export type todayCinemasRecord = z.infer<typeof todayCinemasRecordScehma>
export type DayEntry = z.infer<typeof dayEntrySchema>



