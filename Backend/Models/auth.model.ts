import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.ts'

export const userProfileSelect = {
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

export type UserProfile = Prisma.userGetPayload<{ select: typeof userProfileSelect }>
export type DbUser = Prisma.userGetPayload<Prisma.userDefaultArgs>

export async function insertUser(name: string, username: string, password: string): Promise<UserProfile> {
  return prisma.user.create({
    data: {
      name,
      username,
      password,
      image: 'https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg',
    },
    select: userProfileSelect,
  })
}

export async function getUserByUsername(username: string): Promise<DbUser | null> {
  return prisma.user.findUnique({
    where: {
      username,
    },
  })
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: userProfileSelect,
  })
}
