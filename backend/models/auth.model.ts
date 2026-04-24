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

// export type UserProfile = Prisma.userGetPayload<{ select: typeof userProfileSelect }>
// export type DbUser = Prisma.userGetPayload<Prisma.userDefaultArgs>

export async function insertUser(name: string, username: string, password: string) {
  return prisma.user.create({
    data: {
      name,
      username,
      password,
    },
    select: userProfileSelect,
  })
}

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
    select: userProfileSelect,
  })
}
