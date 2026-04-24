
import z from 'zod';


export const paramsWithpostIdSceham = z.object({
    postId: z.uuidv4("Invalid post id")
})

export const paramsWithUserIdSceham = z.object({
    userId: z.uuidv4("Invalid user id")
})

export const paramsWithUsernameSchema = z.object({
    username: z.string().min(3, 'Invalid username')
})