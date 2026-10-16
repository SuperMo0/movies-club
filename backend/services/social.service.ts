import type { CreateCommentBody, CreatePostBodyServer, GetPostsQuery, UpdateProfileBodyServer } from 'moviesclub-shared/social'
import { appError } from '../errors/appError.ts'
import { prisma } from '../lib/prisma.ts'
import { Prisma } from '../generated/prisma/client.ts'



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


// Cursor pagination: newest first, `cursor` is the id of the last post the client already has.
// One extra row is fetched to know whether another page exists.
export async function getPosts({ cursor, limit }: GetPostsQuery) {

    const rows = await prisma.post.findMany({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        include: {
            comments: {
                include: { author: { select: safeUserSelection } },
            },
            _count: { select: { likedBy: true }, },
            author: { select: safeUserSelection }
        }
    })

    const hasMore = rows.length > limit;
    const posts = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? posts.at(-1)!.id : null;
    return { posts, nextCursor };
}


const TRENDING_WINDOW_DAYS = 30;

// Movies with the most rating posts lately, and the recent posts with the most comments.
export async function getTrending() {
    const since = new Date(Date.now() - TRENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const movieGroups = await prisma.post.groupBy({
        by: ['movieTitle'],
        where: { movieTitle: { not: null }, createdAt: { gte: since } },
        _count: { _all: true },
        _avg: { rating: true },
        orderBy: [{ _count: { movieTitle: 'desc' } }, { _avg: { rating: 'desc' } }],
        take: 5,
    });

    const hotPosts = await prisma.post.findMany({
        where: { createdAt: { gte: since }, comments: { some: {} } },
        orderBy: [{ comments: { _count: 'desc' } }, { likedBy: { _count: 'desc' } }, { createdAt: 'desc' }],
        take: 3,
        select: {
            id: true,
            content: true,
            movieTitle: true,
            author: { select: { username: true, name: true } },
            _count: { select: { comments: true, likedBy: true } },
        },
    });

    return {
        trendingMovies: movieGroups.map(group => ({
            title: group.movieTitle!,
            posts: group._count._all,
            averageRating: group._avg.rating === null ? null : Math.round(group._avg.rating * 10) / 10,
        })),
        hotDiscussions: hotPosts.map(({ _count, ...post }) => ({
            ...post,
            comments: _count.comments,
            likes: _count.likedBy,
        })),
    };
}


export async function getUserLikedPosts(userId: string) {

    const result = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            likedPosts: {
                select: { id: true }
            }
        }
    });

    if (!result) {
        throw new appError(404, "User not found");
    }

    const finalResult = result.likedPosts.map(post => post.id);
    return finalResult;
}


export async function getUserProfileData(username: string) {

    const result = await prisma.user.findFirst({
        where: {
            username: username
        },
        select: {
            ...safeUserSelection,
            posts: {
                include: {
                    comments: { include: { author: { select: safeUserSelection } } },
                    author: { select: safeUserSelection },
                    _count: { select: { likedBy: true } }
                },
                orderBy: { createdAt: 'desc' },
            }

        }
    })

    if (!result) {
        throw new appError(404, "User not found");
    }

    return result;
}

export async function getUserFollowsList(userId: string) {
    const result = await prisma.user.findFirst({
        where: { id: userId },
        select: {
            following: { select: { id: true } }
        }
    });
    if (!result) {
        throw new appError(404, "User not found");
    }
    const finalResult = result?.following.map(u => u.id) || [];
    return finalResult;
}

export async function likePost(postId: string, userId: string) {

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            likedBy: {
                connect: {
                    id: userId
                }
            }
        },
        include: {
            _count: {
                select: { likedBy: true }
            },
            author: { select: safeUserSelection },
            comments: { include: { author: { select: safeUserSelection } } }
        }
    })
    return result;
}


export async function unlikePost(postId: string, userId: string) {

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            likedBy: {
                disconnect: {
                    id: userId
                }
            }
        },
        include: {
            _count: {
                select: { likedBy: true }
            },
            author: { select: safeUserSelection }
        }

    })

    return result;
}

export async function commentOnPost(userId: string, postId: string, body: CreateCommentBody) {
    const result = await prisma.comment.create({
        data: {
            authorId: userId,
            content: body.content,
            postId: postId,
        },
        include: {
            author: { select: safeUserSelection },
        }
    })
    return result;
}

export async function createPost(userId: string, body: CreatePostBodyServer) {

    const result = await prisma.post.create({
        data: {
            authorId: userId,
            content: body.content,
            movieTitle: body.movieTitle ?? null,
            rating: body.rating ?? null,
            image: body.image ?? null
        },
        include: {
            author: {
                select: safeUserSelection
            },
            _count: { select: { likedBy: true, comments: true } },
            comments: { include: { author: { select: safeUserSelection } } }
        }
    });

    return result;
}

export async function updateUserProfile(userId: string, body: UpdateProfileBodyServer) {
    const { bio, name, image } = body;
    const result = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(bio !== undefined && { bio }),
            ...(name !== undefined && { name }),
            ...(image !== undefined && { image })
        },
        select: safeUserSelection
    });
    return result;
}


export async function followUser(userId: string, targetUserId: string) {
    const result = await prisma.user.update({
        where: { id: userId },
        data: {
            following: {
                connect: {
                    id: targetUserId
                }
            }
        },
        include: {
            following: true
        }
    });

    const finalResult = result.following.map(u => u.id);
    return finalResult;
}

export async function unfollowUser(userId: string, targetUserId: string) {
    const result = await prisma.user.update({
        where: { id: userId },
        data: {
            following: {
                disconnect: {
                    id: targetUserId
                }
            }
        },
        include: {
            following: true
        }
    });
    const finalResult = result.following.map(u => u.id);
    return finalResult;
}


