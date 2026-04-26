import type { SessionResponse } from "@/api/auth.api";
import { queryClient } from "@/main";
import type { CreateCommentBody, CreatePostBodyClient, Post, UpdateProfileBodyClient } from "moviesclub-shared/social";

export function createComment(comment: CreateCommentBody, post: Post) {
    const authUser = queryClient.getQueryData<SessionResponse>(["session"])?.user;
    if (!authUser) throw Error("no session was found while performing a mutation");
    const optimisticComment = {
        ...comment,
        id: crypto.randomUUID(),
        author: authUser,
        authorId: authUser.id,
        createdAt: new Date().toLocaleDateString(),
        postId: post.id,
    }
    return optimisticComment;

}

export function createPost(post: CreatePostBodyClient) {
    const authUser = queryClient.getQueryData<SessionResponse>(["session"])?.user;
    if (!authUser) throw Error("no session was found while performing a mutation");

    let secureURL: string | undefined
    if (post.image) {
        secureURL = URL.createObjectURL(post.image);
    }
    const optimisticPost = {
        ...post,
        image: secureURL,
        author: authUser,
        createdAt: new Date().toString(),
        authorId: authUser.id,
        id: crypto.randomUUID(),
        comments: [],
        _count: { likedBy: 0 }
    };
    return optimisticPost;
}