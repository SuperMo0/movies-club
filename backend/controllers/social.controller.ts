import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.ts'
import v2 from '../lib/cloudinary.ts'
import { userProfileSelect } from '../Models/auth.model.ts'
import { createPostBodySchema, updateProfileBodySchema, IdSchema, commentSchema } from 'moviesclub-shared/social'

export async function getFeed(req: Request, res: Response) {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            comments: true,
            _count: { select: { likedBy: true }, }
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

export async function getUserPosts(req: Request<{ userId: string }>, res: Response) {

    const userId = req.params.userId;

    let parseResult = IdSchema.safeParse(userId);

    if (parseResult.error) {
        return res.status(403).json({ message: parseResult.error.message });
    }

    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            comments: true,
            _count: { select: { likedBy: true } }
        },
        where: {
            authorId: userId
        }
    }
    )
    return res.json({ posts });
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

    const validatedBody = commentSchema.safeParse(req.body);
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

export async function createPost(req: Request, res: Response) {
    const userId = req.userId!;
    const image = req.file;

    const validatedBody = createPostBodySchema.safeParse(req.body);
    if (!validatedBody.success) {
        return res.status(403).json({ message: validatedBody.error.message });
    }

    let { content, movieTitle, rating } = validatedBody.data;

    let imageUrl = null;

    if (image) imageUrl = await uploadImage(image.buffer);

    const post = await prisma.post.create({
        data: {
            authorId: userId,
            content: content,
            image: imageUrl,
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

async function uploadImage(image: any): Promise<string | null> {
    if (!image) return null;

    const response = await v2.uploader.upload(image, {
        resource_type: "image",
    })

    return response.secure_url;
}

export async function updateProfile(req: Request, res: Response) {
    const userId = req.userId!;

    const image = req.file;

    const validatedBody = updateProfileBodySchema.safeParse(req.body);
    if (!validatedBody.success) {
        return res.status(403).json({ message: validatedBody.error.message });
    }

    const { name, bio } = validatedBody.data;

    const updateData: any = {
        name: name,
        bio: bio,
    };

    if (image) {
        const imageUrl = await uploadImage(image.buffer);
        updateData.image = imageUrl;
    }

    let updatedUser;

    updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true,
            joinedAt: true,
            _count: {
                select: { followedBy: true, following: true }
            }
        }
    });

    return res.json({
        user: updatedUser,
        message: "Success"
    });
}
