import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.ts'
import { userProfileSelect } from '../Models/auth.model.ts'
import { IdSchema, createPostBodyServerSchema, type CreatePostBodyServer, type UpdateProfileBodyServer, updateProfileBodyServerSchema, createCommentBodySchema } from 'moviesclub-shared/social'

export async function getFeed(req: Request, res: Response) {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            comments: {
                include: { author: { select: userProfileSelect } },
            },
            _count: { select: { likedBy: true }, },
            author: { select: userProfileSelect }
        }
    })
    return res.json({ posts });
}

export async function getUserLikedPosts(req: Request, res: Response) {

    const userId = req.userId!;
    let parseResult = IdSchema.safeParse(userId);
    if (parseResult.error) {
        return res.status(403).json({ message: parseResult.error.message });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            likedPosts: {
                select: { id: true }
            }
        }
    });

    if (!user) {
        return res.status(403).json({ message: "User not found" });
    }

    const likedPostIds = user.likedPosts.map(post => post.id);

    return res.json({ likedPosts: likedPostIds });
}


export async function getUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany({
        select: userProfileSelect
    })
    return res.json({ users });
}

export async function getUserPosts(req: Request<{ username: string }>, res: Response) {

    console.log('here');

    const username = req.params.username;

    const userData = await prisma.user.findFirst({
        where: {
            username: username
        },
        include: {
            posts: {
                orderBy: { createdAt: 'desc' },
                include: {
                    comments: { include: { author: { select: userProfileSelect } } },
                    _count: {
                        select: { likedBy: true }
                    }
                },
            }
        },
        omit: {
            password: true
        },
    })
    return res.json(userData);
}

export async function likePost(req: Request, res: Response) {

    let postId = req.params.postId;

    const userId = req.userId!

    const parseResult = IdSchema.safeParse(postId);
    if (!parseResult.success) {
        return res.status(403).json({ message: parseResult.error.message });
    }
    postId = parseResult.data;

    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            likedBy: {
                connect: {
                    id: userId
                }
            }
        }

    })
    return res.status(201).json({ message: "success" });
}


export async function deleteLikePost(req: Request, res: Response) {
    let postId = req.params.postId;

    const userId = req.userId!;

    const parseResult = IdSchema.safeParse(postId);
    if (!parseResult.success) {
        return res.status(403).json({ message: parseResult.error.message });
    }
    postId = parseResult.data;

    const result = await prisma.post.update({
        data: {
            likedBy: {
                disconnect: {
                    id: userId
                }
            }
        },
        select: {
            _count: { select: { likedBy: true } }
        },
        where: {
            id: postId
        }
    })

    return res.status(200).json({ message: "success", result });
}




export async function commentPost(req: Request, res: Response) {
    let postId = req.params.postId;
    const userId = req.userId!;

    const validatedParam = IdSchema.safeParse(postId);
    if (!validatedParam.success) {
        return res.status(403).json({ message: validatedParam.error.message });
    }
    postId = validatedParam.data;

    const validatedBody = createCommentBodySchema.safeParse(req.body);
    if (!validatedBody.success) {
        return res.status(403).json({ message: validatedBody.error.message });
    }
    const { content } = validatedBody.data;

    const result = await prisma.comment.create({
        data: {
            authorId: userId,
            content: content,
            postId: postId,
        }
    })

    return res.status(201).json({ comment: result })
}

export async function createPost(req: Request<{}, {}, CreatePostBodyServer>, res: Response) {

    const userId = req.userId!;

    const validatedBody = createPostBodyServerSchema.safeParse(req.body);
    if (!validatedBody.success) {
        console.log(validatedBody.error.message);
        return res.status(403).json({ message: validatedBody.error.message });
    }

    let { content, movieTitle, rating, image } = validatedBody.data;

    const post = await prisma.post.create({
        data: {
            authorId: userId,
            content: content,
            image: image || null,
            movieTitle: movieTitle || null,
            rating: rating || null
        },
        include: {
            author: {
                select: userProfileSelect
            },
            _count: { select: { likedBy: true, comments: true } }
        }
    });

    return res.json({ post });
}


export async function updateProfile(req: Request<{}, {}, UpdateProfileBodyServer>, res: Response) {

    const userId = req.userId!;

    const validatedBody = updateProfileBodyServerSchema.safeParse(req.body);
    if (!validatedBody.success) {
        return res.status(403).json({ message: validatedBody.error.message });
    }

    const { name, bio, image } = validatedBody.data;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            bio: bio ?? undefined,
            name: name ?? undefined,
            image: image ?? undefined
        },
        select: userProfileSelect
    });

    return res.json({
        user: updatedUser,
    });
}
