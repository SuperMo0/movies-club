import type { SessionResponse } from '@/api/auth';
import { DELETEFollowUser, DELETELikePost, orchesteratePostCreation, orchesterateProfileUpadate, POSTComment, POSTFollowUser, POSTLikePost, PUTUserProfile, SignAndUploadCloudinary, type GETFollowsResponse, type POSTPostResponse } from '@/api/social'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios';
import type { Post, UpdateProfileBodyClient, UserProfileData } from 'moviesclub-shared/social';


export function usePOSTLikePost() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTLikePost,
        onMutate: (post) => {
            queryClient.setQueryData<string[]>(["userLikedPosts"], (s) => [...s!, post.id])
            queryClient.setQueryData<Post[]>(["posts"], (s) => {
                if (s) {
                    const currentPost = s!.find(p => p.id == post.id)
                    return s?.map(p => p.id == post.id ? { ...p, _count: { likedBy: currentPost!._count.likedBy + 1 } } : p);
                } else return s;
            })
            queryClient.setQueryData<UserProfileData>(["profile", post.authorUsername], ((d) => {
                if (d) {
                    return {
                        ...d, posts: d.posts.map(p => {
                            return { ...p, _count: { likedBy: p._count.likedBy + 1 } }
                        })
                    }
                } else return d;

            }))
            // todo :return the previous state so that in case of failure we can rollback easily
        },
        onError: (e) => { console.log(e); }
    })
}

export function useDELETELikePost() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DELETELikePost,
        onMutate: (post) => {
            queryClient.setQueryData<string[]>(["userLikedPosts"], (s) => s?.filter(d => d != post.id))
            queryClient.setQueryData<Post[]>(["posts"], (s) => {
                if (s) {
                    const currentPost = s!.find(p => p.id == post.id)
                    return s?.map(p => p.id == post.id ? { ...p, _count: { likedBy: currentPost!._count.likedBy - 1 } } : p);
                } else return s;
            });
            queryClient.setQueryData<UserProfileData>(["profile", post.authorUsername], ((d) => {
                if (d) {
                    return {
                        ...d, posts: d.posts.map(p => {
                            return { ...p, _count: { likedBy: p._count.likedBy - 1 } }
                        })
                    }
                } else return d;
            }))
        },
    })
}

export function usePOSTComment() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTComment,
        onSuccess: (x, s) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ["profile", s.post.authorUsername] });
        }
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
                    authorUsername: authUser.username,
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
        onSuccess: (data) => {
            queryClient.setQueryData<SessionResponse>(["session"], (d) => { return data })
            queryClient.setQueryData<UserProfileData>(["profile", data.user!.username], (d) => { if (d) return { ...d, ...data.user } })
        }
    })
}


export function usePOSTFollowUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTFollowUser,
        onSuccess: (data, targetId) => {
            queryClient.setQueryData<GETFollowsResponse>(["follows",], (d) => { if (d) return [...d, targetId] });
        }
    })
}

export function useDELETEFollowUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DELETEFollowUser,
        onSuccess: (data, targetId) => {
            queryClient.setQueryData<GETFollowsResponse>(["follows",], (d) => { if (d) return d.filter(d => d != targetId) });
        }
    })
}