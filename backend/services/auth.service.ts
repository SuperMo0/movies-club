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


export async function insertUser(name: string, username: string, password: string) {
    const result = prisma.user.create({
        data: {
            name,
            username,
            password,
        },
        select: safeUserSelection,
    })
}

// we don't want to let prisma throws here because we don't want to return 404 when someone tries to login with some username
// because if we return 404 when username is wrong and 401 when password is wrong this will expose users usernames
// however we are currently sending the username in the payloads anyway and we need to change this in the feture for security

export async function getUserByUsername(username: string) {
    return prisma.user.findUnique({
        where: {
            username,
        },
    })
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: {
            id,
        },
        select: safeUserSelection,
    })
}
