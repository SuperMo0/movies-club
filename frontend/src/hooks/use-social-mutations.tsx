import type { SessionResponse } from '@/api/auth.api';
import { DELETEFollowUser, DELETELikePost, orchesteratePostCreation, orchesterateProfileUpadate, POSTComment, POSTFollowUser, POSTLikePost, PUTUserProfile, SignAndUploadCloudinary, type GETFollowsResponse, type POSTPostResponse } from '@/api/social.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios';
import type { Post, UpdateProfileBodyClient, UserProfileData } from 'moviesclub-shared/social';


export function usePOSTLikePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTLikePost,
        onMutate: async (post) => {
            await queryClient.cancelQueries({ queryKey: ["userLikedPosts"] });
            await queryClient.cancelQueries({ queryKey: ["profile", post.authorUsername] });
            await queryClient.cancelQueries({ queryKey: ["posts"] });

            const prevUserLikedPosts = queryClient.getQueryData<string[]>(["userLikedPosts"]);
            const prevPosts = queryClient.getQueryData<Post[]>(["posts"]);
            const prevUserProfile = queryClient.getQueryData<UserProfileData>(["profile", post.authorUsername]);

            queryClient.setQueryData<string[]>(["userLikedPosts"], (s) => [...s!, post.id])
            queryClient.setQueryData<Post[]>(["posts"], (s) => {
                if (s) return s?.map(p => p.id == post.id ? { ...p, _count: { likedBy: p._count.likedBy + 1 } } : p);
            })
            queryClient.setQueryData<UserProfileData>(["profile", post.authorUsername], ((d) => {
                if (d) {
                    return {
                        ...d, posts: d.posts.map(p => {
                            return { ...p, _count: { likedBy: p._count.likedBy + 1 } }
                        })
                    }
                };

            }))
            return { prevPosts, prevUserLikedPosts, prevUserProfile };
        },
        onError: (e, post, prev) => {
            console.error(e);
            queryClient.setQueryData<string[]>(["userLikedPosts"], prev?.prevUserLikedPosts);
            queryClient.setQueryData<Post[]>(["posts"], prev?.prevPosts);
            queryClient.setQueryData<UserProfileData>(["profile", post.authorUsername], prev?.prevUserProfile);
        },
        onSettled: (d, e, post) => {
            queryClient.invalidateQueries({ queryKey: ["userLikedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["profile", post.authorUsername] });
        }
    })
}

export function useDELETELikePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DELETELikePost,
        onMutate: async (post) => {
            await queryClient.cancelQueries({ queryKey: ["userLikedPosts"] });
            await queryClient.cancelQueries({ queryKey: ["profile", post.authorUsername] });
            await queryClient.cancelQueries({ queryKey: ["posts"] });

            const prevUserLikedPosts = queryClient.getQueryData<string[]>(["userLikedPosts"]);
            const prevPosts = queryClient.getQueryData<Post[]>(["posts"]);
            const prevProfileData = queryClient.getQueryData<UserProfileData>(["profile", post.authorUsername]);

            queryClient.setQueryData<string[]>(["userLikedPosts"], (s) => s?.filter(d => d != post.id))
            queryClient.setQueryData<Post[]>(["posts"], (s) => {
                if (s) return s?.map(p => p.id == post.id ? { ...p, _count: { likedBy: p!._count.likedBy - 1 } } : p);
            });
            queryClient.setQueryData<UserProfileData>(["profile", post.authorUsername], ((d) => {
                if (d) {
                    return {
                        ...d, posts: d.posts.map(p => {
                            return { ...p, _count: { likedBy: p._count.likedBy - 1 } }
                        })
                    }
                };
            }))
            return { prevPosts, prevUserLikedPosts, prevProfileData };
        },
        onError: (e, post, prev) => {
            console.error(e);
            queryClient.setQueryData<string[]>(["userLikedPosts"], prev?.prevUserLikedPosts);
            queryClient.setQueryData<Post[]>(["posts"], prev?.prevPosts);
            queryClient.setQueryData<UserProfileData>(["profile", post.authorUsername], prev?.prevProfileData);
        },
        onSettled: (d, e, post) => {
            queryClient.invalidateQueries({ queryKey: ["userLikedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["profile", post.authorUsername] });
        }
    })
}

export function usePOSTComment() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTComment,
        onMutate: async (vars) => {
            const authUser = queryClient.getQueryData<SessionResponse>(["session"])!;
            if (!authUser || !authUser.user) return;

            await queryClient.cancelQueries({ queryKey: ["posts"] });
            await queryClient.cancelQueries({ queryKey: ["profile", vars.post.authorUsername] });

            const prevPosts = queryClient.getQueryData<Post[]>(["posts"]);
            const prevProfileData = queryClient.getQueryData<Post[]>(["profile", vars.post.authorUsername]);

            const optimsticComment = {
                ...vars.comment,
                id: crypto.randomUUID(),
                author: authUser.user!,
                authorId: authUser.user!.id,
                createdAt: new Date().toLocaleDateString(),
                postId: vars.post.id,
            }
            queryClient.setQueryData<Post[]>(["posts"],
                (s => s?.map(p => p.id == vars.post.id ? {
                    ...p,
                    comments: [...p.comments, optimsticComment]
                } : p)))


            queryClient.setQueryData<UserProfileData>(["profile", vars.post.authorUsername], (profileData) => {
                if (profileData) {
                    return {
                        ...profileData, posts: profileData.posts.map(p => p.id == vars.post.id
                            ? { ...p, comments: [...p.comments, optimsticComment] } :
                            p)
                    }
                }
            })

            return { prevPosts, prevProfileData };
        },
        onError: (err, vars, prev) => {
            console.error(err);
            queryClient.setQueryData<Post[]>(["posts"], prev?.prevPosts);
            queryClient.setQueryData<Post[]>(["profile", vars.post.authorUsername], prev?.prevProfileData);
        },
        onSuccess: (res, vars) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ["profile", vars.post.authorUsername] });
        },
    })
}

export function usePOSTPost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orchesteratePostCreation,
        onMutate: async (newPost) => {
            const authUser = queryClient.getQueryData<SessionResponse>(["session"])?.user;
            if (!authUser) return;

            await queryClient.cancelQueries({ queryKey: ["posts"] });

            const prevPosts = queryClient.getQueryData<Post[]>(["posts"]);
            const prevProfileData = queryClient.getQueryData<UserProfileData>(["profile", authUser.username]);


            let secureURL: string | undefined
            if (newPost.image) {
                secureURL = URL.createObjectURL(newPost.image);
            }
            const optimisticPost = {
                ...newPost,
                image: secureURL,
                author: authUser,
                createdAt: new Date().toString(),
                authorId: authUser.id,
                authorUsername: authUser.username,
                id: crypto.randomUUID(),
                comments: [],
                _count: { likedBy: 0 }
            };
            queryClient.setQueryData(["posts"], (currentPosts: Post[]) => [optimisticPost, ...currentPosts]);

            return { prevPosts, prevProfileData };
        },
        onError: (err, vars, prev) => {
            console.error(err);
            queryClient.setQueryData<Post[]>(["posts"], prev?.prevPosts);
            queryClient.setQueryData<UserProfileData>(["profile", prev?.prevProfileData?.username], prev?.prevProfileData);
        },
        onSettled: (res, err, vars, prev) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ["profile", prev?.prevProfileData?.username] });
        },

    })
}

export function usePUTUserProfile() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orchesterateProfileUpadate,
        onMutate: async (vars) => {
            const session = queryClient.getQueryData<SessionResponse>(["session"]);
            if (!session || !session.user) return;
            const currentUsername = session.user.username;

            await queryClient.cancelQueries({ queryKey: ["session"] });
            await queryClient.cancelQueries({ queryKey: ["profile", currentUsername] });

            const prevSession = queryClient.getQueryData<SessionResponse>(["session"]);
            const prevProfile = queryClient.getQueryData<UserProfileData>(["profile", currentUsername]);

            let secureURL: string | undefined;
            if (vars.image) {
                secureURL = URL.createObjectURL(vars.image);
            }

            const optimisticUpdates = { ...vars, ...(secureURL ? { image: secureURL } : {}) };

            queryClient.setQueryData<SessionResponse>(["session"], (d) => {
                if (d && d.user) return { ...d, user: { ...d.user, ...optimisticUpdates } as any };
                return d;
            });

            queryClient.setQueryData<UserProfileData>(["profile", currentUsername], (d) => {
                if (d) return { ...d, ...optimisticUpdates } as any;
                return d;
            });

            return { prevSession, prevProfile, currentUsername };
        },
        onError: (err, vars, prev) => {
            console.error(err);
            if (prev) {
                queryClient.setQueryData<SessionResponse>(["session"], prev.prevSession);
                queryClient.setQueryData<UserProfileData>(["profile", prev.currentUsername], prev.prevProfile);
            }
        },
        onSettled: (data, err, vars, prev) => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            queryClient.invalidateQueries({ queryKey: ["profile", prev?.currentUsername] });
        }
    })
}


export function usePOSTFollowUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTFollowUser,
        onMutate: async (targetId) => {
            await queryClient.cancelQueries({ queryKey: ["follows"] });
            const prevFollows = queryClient.getQueryData<GETFollowsResponse>(["follows"]);

            queryClient.setQueryData<GETFollowsResponse>(["follows"], (d) => {
                if (d) return [...d, targetId];
            });

            return { prevFollows };
        },
        onError: (err, targetId, prev) => {
            console.error(err);
            if (prev?.prevFollows) {
                queryClient.setQueryData<GETFollowsResponse>(["follows"], prev.prevFollows);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["follows"] });
        }
    })
}

export function useDELETEFollowUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DELETEFollowUser,
        onMutate: async (targetId) => {
            await queryClient.cancelQueries({ queryKey: ["follows"] });
            const prevFollows = queryClient.getQueryData<GETFollowsResponse>(["follows"]);

            queryClient.setQueryData<GETFollowsResponse>(["follows"], (d) => {
                if (d) return d.filter(id => id != targetId);
            });

            return { prevFollows };
        },
        onError: (err, targetId, prev) => {
            console.error(err);
            if (prev?.prevFollows) {
                queryClient.setQueryData<GETFollowsResponse>(["follows"], prev.prevFollows);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["follows"] });
        }
    })
}