import type { SignupBody } from 'moviesclub-shared/auth';
import type { Prisma } from '../generated/prisma/client.ts'
import { prisma } from '../lib/prisma.ts'



export const safeUserSelection = {
    id: true,
    name: true,
    username: true,
    image: true,
    bio: true,
    joinedAt: true,
    _count: {
        select: {
            followedBy: true,
            following: true,
        },
    },
} satisfies Prisma.userSelect


export async function insertUser(newUser: SignupBody) {
    const result = prisma.user.create({
        data: {
            name: newUser.name,
            username: newUser.username,
            password: newUser.password,
        },
        select: safeUserSelection,
    })
    return result;
}


export async function getUserByUsername(username: string) {
    const result = prisma.user.findUnique({
        where: {
            username,
        },
        include: {
            _count: { select: { followedBy: true, following: true } }
        }
    })
    return result;
}

export async function getUserById(id: string) {
    const result = prisma.user.findUnique({
        where: {
            id,
        },
        select: safeUserSelection,
    })
    return result;
}
