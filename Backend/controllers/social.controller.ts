import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.ts'
import v2 from '../lib/cloudinary.ts'
import { userProfileSelect } from './../Models/auth.model.ts'
import {
    userIdParamSchema,
    postIdParamSchema,
    commentBodySchema,
    createPostBodySchema,
    updateProfileBodySchema
} from '../../Shared/social.schema.ts'
import { AppError } from '../errors/appError.ts'
import { requireUserId } from '../types/authenticatedRequest.ts'

function validationError(message: string, details?: unknown) {
    return new AppError({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message,
        publicMessage: 'Validation failed',
        details,
    })
}

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
    const userId = requireUserId(req);

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
        throw new AppError({
            statusCode: 404,
            code: 'USER_NOT_FOUND',
            message: `User ${userId} not found while fetching liked posts`,
            publicMessage: 'User not found',
        })
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

export async function getUserPosts(req: Request, res: Response) {
    let userId = req?.params?.userId;

    const validatedParams = userIdParamSchema.safeParse({ userId });
    if (!validatedParams.success) {
        throw validationError(validatedParams.error.message, validatedParams.error.issues)
    }
    userId = validatedParams.data.userId;

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
    let postId = req?.params?.postId;
    const userId = requireUserId(req);

    const validatedParams = postIdParamSchema.safeParse({ postId });
    if (!validatedParams.success) {
        throw validationError(validatedParams.error.message, validatedParams.error.issues)
    }
    postId = validatedParams.data.postId;

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
    return res.status(201).json({ message: "done" })
}


export async function deleteLikePost(req: Request, res: Response) {
    let postId = req?.params?.postId;
    const userId = requireUserId(req);

    const validatedParams = postIdParamSchema.safeParse({ postId });
    if (!validatedParams.success) {
        throw validationError(validatedParams.error.message, validatedParams.error.issues)
    }
    postId = validatedParams.data.postId;

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

    return res.status(200).json({ message: "done", count: result._count.likedBy })
}






export async function commentPost(req: Request, res: Response) {
    let postId = req?.params?.postId;
    const userId = requireUserId(req);

    const validatedParams = postIdParamSchema.safeParse({ postId });
    if (!validatedParams.success) {
        throw validationError(validatedParams.error.message, validatedParams.error.issues)
    }
    postId = validatedParams.data.postId;

    const validatedBody = commentBodySchema.safeParse(req.body);
    if (!validatedBody.success) {
        throw validationError(validatedBody.error.message, validatedBody.error.issues)
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
    const userId = requireUserId(req);
    const image = req.file;

    const validatedBody = createPostBodySchema.safeParse(req.body);
    if (!validatedBody.success) {
        throw validationError(validatedBody.error.message, validatedBody.error.issues)
    }

    let { content, movieId, rating: _rating } = validatedBody.data;

    if (movieId === 'null' || movieId === '') movieId = null;


    let imageUrl = null;

    if (image) {
        try {
            imageUrl = await uploadImage(image.buffer);
        } catch (error) {
            throw new AppError({
                statusCode: 500,
                code: 'IMAGE_UPLOAD_FAILED',
                message: 'Error uploading image',
                publicMessage: 'Error uploading image',
                details: error,
            })
        }
    }

    const post = await prisma.post.create({
        data: {
            authorId: userId,
            content: content,
            image: imageUrl,
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

    const imageUrl = await new Promise<string>((resolve, reject) => {
        const stream = v2.uploader.upload_stream(
            {
                resource_type: 'image',
            },
            (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result.secure_url);
            }
        );
        stream.end(image);
    });


    return imageUrl;

}

export async function updateProfile(req: Request, res: Response) {
    const userId = requireUserId(req);
    const image = req.file;

    const validatedBody = updateProfileBodySchema.safeParse(req.body);
    if (!validatedBody.success) {
        throw validationError(validatedBody.error.message, validatedBody.error.issues)
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
    try {
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
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
            throw new AppError({
                statusCode: 404,
                code: 'USER_NOT_FOUND',
                message: `User ${userId} not found while updating profile`,
                publicMessage: 'User not found',
            })
        }

        throw error
    }

    return res.json({
        user: updatedUser,
        message: "Profile updated successfully"
    });
}
