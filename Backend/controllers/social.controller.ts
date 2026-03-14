import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js'
import v2 from '../lib/cloudinary.js'
import { userProfileSelect } from './../Models/auth.model.js'
import {
    userIdParamSchema,
    postIdParamSchema,
    commentBodySchema,
    createPostBodySchema,
    updateProfileBodySchema
} from '../../Shared/social.schema.js'

export async function getFeed(req: Request, res: Response, next: NextFunction) {

    try {
        let posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                comments: true,
                _count: { select: { likedBy: true }, }
            }
        })

        res.json({ posts });
    } catch (error) {
        next(error);
    }
}

export async function getUserLikedPosts(req: Request & { userId: string }, res: Response) {
    try {
        const userId = req.userId;

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
            return res.status(404).json({ message: "User not found" });
        }

        const likedPostIds = user.likedPosts.map(post => post.id);

        return res.json({ likedPosts: likedPostIds });

    } catch (error) {
        console.error("Get Liked Posts Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        let users = await prisma.user.findMany({
            select: userProfileSelect
        })
        res.json({ users });
    } catch (error) {
        console.log(error);

        next(error);
    }
}

export async function getUserPosts(req: Request, res: Response, next: NextFunction) {

    try {
        let userId = req?.params?.userId;

        const validatedParams = userIdParamSchema.safeParse({ userId });
        if (!validatedParams.success) {
            return res.status(400).json({ message: validatedParams.error.message || 'bad request' });
        }
        userId = validatedParams.data.userId;

        let posts = await prisma.post.findMany({
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
        res.json({ posts });
    } catch (error) {
        console.log(error);

        next(error);
    }

}

export async function likePost(req: Request & { userId: string }, res: Response, next: NextFunction) {

    try {
        let postId = req?.params?.postId;
        let userId = req.userId;

        const validatedParams = postIdParamSchema.safeParse({ postId });
        if (!validatedParams.success) {
            return res.status(400).json({ message: validatedParams.error.message || 'bad request' });
        }
        postId = validatedParams.data.postId;

        let result = await prisma.post.update({
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
        res.status(201).json({ message: "done" })

    } catch (error) {
        console.log(error);
        next(error)
    }
}


export async function deleteLikePost(req: Request & { userId: string }, res: Response, next: NextFunction) {
    try {
        let postId = req?.params?.postId;
        let userId = req.userId;

        const validatedParams = postIdParamSchema.safeParse({ postId });
        if (!validatedParams.success) {
            return res.status(400).json({ message: validatedParams.error.message || 'bad request' });
        }
        postId = validatedParams.data.postId;

        let result = await prisma.post.update({
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

        res.status(200).json({ message: "done", count: result._count.likedBy })

    } catch (error) {
        console.log(error);
        next(error)
    }
}






export async function commentPost(req: Request & { userId: string }, res: Response, next: NextFunction) {

    try {
        let postId = req?.params?.postId;
        let userId = req.userId;

        const validatedParams = postIdParamSchema.safeParse({ postId });
        if (!validatedParams.success) {
            return res.status(400).json({ message: validatedParams.error.message || 'bad request' });
        }
        postId = validatedParams.data.postId;

        const validatedBody = commentBodySchema.safeParse(req.body);
        if (!validatedBody.success) {
            return res.status(400).json({ message: validatedBody.error.message || 'bad request' });
        }
        const { content } = validatedBody.data;

        let result = await prisma.comment.create({
            data: {
                authorId: userId,
                content: content,
                postId: postId,
            }
        })

        res.status(201).json({ comment: result })

    } catch (error) {
        console.log(error);
        next(error)
    }

}

export async function createPost(req: Request & { userId: string, file?: any }, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const image = req.file;

        const validatedBody = createPostBodySchema.safeParse(req.body);
        if (!validatedBody.success) {
            return res.status(400).json({ message: validatedBody.error.message || 'bad request' });
        }

        let { content, movieId, rating } = validatedBody.data;

        if (movieId === 'null' || movieId === '') movieId = null;


        const dbRating = (rating && rating !== 'null') ? Number(rating) : null;

        let imageUrl = null;

        if (image) {
            try {
                imageUrl = await uploadImage(image.buffer, 'social_posts');
            } catch (uploadError) {
                console.error('Cloudinary Error:', uploadError);
                return res.status(500).json({ message: 'Error uploading image' });
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

    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function uploadImage(image: any, folder: string = ''): Promise<string | null> {
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

export async function updateProfile(req: Request & { userId: string, file?: any }, res: Response) {
    try {
        const userId = req.userId;
        const image = req.file;

        const validatedBody = updateProfileBodySchema.safeParse(req.body);
        if (!validatedBody.success) {
            return res.status(400).json({ message: validatedBody.error.message || 'bad request' });
        }

        const { name, bio } = validatedBody.data;

        const updateData: any = {
            name: name,
            bio: bio,
        };

        if (image) {
            let imageUrl = await uploadImage(image.buffer);

            updateData.image = imageUrl;
        }

        const updatedUser = await prisma.user.update({
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
            message: "Profile updated successfully"
        });

    } catch (error: any) {
        console.error("Update Profile Error:", error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
}