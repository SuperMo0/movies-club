import type { SessionResponse } from '@/api/auth';
import { DELETELikePost, orchesteratePostCreation, orchesterateProfileUpadate, POSTComment, POSTLikePost, PUTUserProfile, SignAndUploadCloudinary, type POSTPostResponse } from '@/api/social'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios';
import type { ResponseSafeUser } from 'moviesclub-shared/auth';
import type { Post, UpdateProfileBodyClient, UpdateProfileBodyServer, UserProfileData } from 'moviesclub-shared/social';


export function usePOSTLikePost() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTLikePost,
        onMutate: (id) => {
            queryClient.setQueryData<string[]>(["userLikedPosts"], (s) => [...s!, id])
            queryClient.setQueryData<Post[]>(["posts"], (s) => {
                const post = s!.find(p => p.id == id)
                return s?.map(p => p.id == id ? { ...p, _count: { likedBy: post!._count.likedBy + 1 } } : p);
            })
            // todo :return the previous state so that in case of failure we can rollback easily
        },
        onError: (e) => { console.log(e); }
    })
}

export function useDELETELikePost() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DELETELikePost,
        onMutate: (id) => {
            queryClient.setQueryData<string[]>(["userLikedPosts"], (s) => s?.filter(d => d != id))
            queryClient.setQueryData<Post[]>(["posts"], (s) => {
                const post = s!.find(p => p.id == id)
                return s?.map(p => p.id == id ? { ...p, _count: { likedBy: post!._count.likedBy - 1 } } : p);
            })
            // todo :return the previous state so that in case of failure we can rollback easily
        },
    })
}

export function usePOSTComment() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTComment,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }) }
    })
}

// todo: swap the real post with the optimistic one for better experince
// todo: handle rollback failure
export function usePOSTPost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orchesteratePostCreation,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }) }, // todo: just swap instead of requesting posts again
        onMutate: (newPost) => {
            queryClient.setQueryData(["posts"], (currentPosts: Post[]): Post[] => {
                let secureURL: string | undefined
                if (newPost.image) {
                    secureURL = URL.createObjectURL(newPost.image);
                }
                const authUser = queryClient.getQueryData<SessionResponse>(["session"])?.user!
                let state = [{
                    ...newPost,
                    image: secureURL,
                    author: authUser,
                    createdAt: new Date().toString(),
                    authorId: authUser.id,
                    id: crypto.randomUUID(),
                    comments: [],
                    _count: { likedBy: 0 }
                }, ...currentPosts]
                return state;
            })
        }
    })
}

export function usePUTUserProfile() {

    const queryClient = useQueryClient();
    return useMutation<SessionResponse, Error | AxiosError, UpdateProfileBodyClient>({
        mutationFn: orchesterateProfileUpadate,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onSuccess: (data) => {
            queryClient.setQueryData<SessionResponse>(["session"], (d) => { return data })
            queryClient.setQueryData<UserProfileData>(["profile", data.user!.username], (d) => { if (d) return { ...d, ...data.user } })
        }
    })
}