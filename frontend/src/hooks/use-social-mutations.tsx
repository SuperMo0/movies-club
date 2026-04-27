import * as cache from '@/utils/cache';
import { produce } from 'immer';
import * as optimisticFactory from '@/utils/optimistic-factory'
import {
    DELETEFollowUser,
    DELETELikePost,
    orchesteratePostCreation,
    orchesterateProfileUpadate,
    POSTCreateCommentOnPost,
    POSTFollowUser,
    POSTLikePost,
} from '@/api/social.api'
import {
    useMutation,
    useQueryClient
} from '@tanstack/react-query'



export function useLikePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTLikePost,
        onMutate: async (post) => {
            await queryClient.cancelQueries({ queryKey: ["userLikedPosts"] });
            await queryClient.cancelQueries({ queryKey: ["profile", post.author.username] });
            await queryClient.cancelQueries({ queryKey: ["posts"] });

            const prevUserLikedPosts = cache.getUserLikedPostsCache();
            const prevPosts = cache.getPostsCache();
            const prevUserProfileData = cache.getUserProfileDataCache(post.author.username);

            cache.setUserLikedPostsCache((data) => produce(data, (data) => {
                data?.likedPosts.push(post.id);
                return data;
            }));
            cache.setPostsCache((data) => produce(data, (draft) => {
                draft?.posts.forEach(p => { if (p.id === post.id) p._count.likedBy += 1 });
            }));
            cache.setUserProfileDataCache((data) => produce(data, (draft) => {
                draft?.userProfileData.posts.forEach((p) => { if (p.id === post.id) p._count.likedBy += 1 });

            }), post.author.username)

            return { prevPosts, prevUserLikedPosts, prevUserProfileData };
        },
        onError: (error, post, context) => {
            console.error(error);
            cache.setPostsCache(() => context?.prevPosts);
            cache.setUserLikedPostsCache(() => context?.prevUserLikedPosts);
            cache.setUserProfileDataCache(() => context?.prevUserProfileData, post.author.username);
        },
        onSettled: (data, error, vars, context) => {
            queryClient.invalidateQueries({ queryKey: ["userLikedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["profile", vars.author.username] });
        }
    })
}

export function useUnlikePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DELETELikePost,
        onMutate: async (post) => {
            await queryClient.cancelQueries({ queryKey: ["userLikedPosts"] });
            await queryClient.cancelQueries({ queryKey: ["profile", post.author.username] });
            await queryClient.cancelQueries({ queryKey: ["posts"] });

            const prevUserLikedPosts = cache.getUserLikedPostsCache();
            const prevPosts = cache.getPostsCache();
            const prevUserProfileData = cache.getUserProfileDataCache(post.author.username);

            cache.setUserLikedPostsCache((data) => produce(data, (draft) => {
                const index = draft?.likedPosts.findIndex((e) => e === post.id)
                if (index && index !== -1) draft?.likedPosts.splice(index, 1);
            }));

            cache.setPostsCache((data) => produce(data, (draft) => {
                draft?.posts.forEach(p => { if (p.id === post.id) p._count.likedBy -= 1 });
            }));

            cache.setUserProfileDataCache((data) => produce(data, (draft) => {
                draft?.userProfileData.posts.forEach((p) => { if (p.id === post.id) p._count.likedBy -= 1 });
            }), post.author.username)

            return { prevPosts, prevUserLikedPosts, prevUserProfileData };
        },
        onError: (error, post, context) => {
            console.error(error);
            cache.setPostsCache(() => context?.prevPosts);
            cache.setUserLikedPostsCache(() => context?.prevUserLikedPosts);
            cache.setUserProfileDataCache(() => context?.prevUserProfileData, post.author.username);
        },
        onSettled: (data, error, vars, context) => {
            queryClient.invalidateQueries({ queryKey: ["userLikedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["profile", vars.author.username] });
        }
    })
}

export function useCommentOnPost() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTCreateCommentOnPost,
        onMutate: async (vars) => {
            const { comment, post } = vars
            const optimsticComment = optimisticFactory.createComment(comment, post);

            await queryClient.cancelQueries({ queryKey: ["posts"] });
            await queryClient.cancelQueries({ queryKey: ["profile", post.author.username] });

            const prevPosts = cache.getPostsCache();
            const prevUserProfileData = cache.getUserProfileDataCache(post.author.username);

            cache.setPostsCache((data) => produce(data, (draft) => {
                draft?.posts.forEach(p => {
                    if (p.id === post.id) p.comments.push(optimsticComment)
                });
            }))

            cache.setUserProfileDataCache((data) => produce(data, (draft) => {
                draft?.userProfileData.posts.forEach(p => {
                    if (p.id === post.id) p.comments.push(optimsticComment)
                });
                return data;

            }), post.author.username);


            return { prevPosts, prevUserProfileData };
        },
        onError: (error, vars, context) => {
            console.error(error);
            cache.setPostsCache(() => context?.prevPosts);
            cache.setUserProfileDataCache(() => context?.prevUserProfileData, vars.post.author.username);
        },
        onSettled: (data, error, vars, context) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ["profile", vars.post.author.username] });
        },
    })
}

export function useCreatePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orchesteratePostCreation,
        onMutate: async (post) => {
            const authUser = cache.getSessionCache()?.user;
            if (!authUser) throw Error("no session was found while performing a mutation");

            await queryClient.cancelQueries({ queryKey: ["posts"] });

            const prevPosts = cache.getPostsCache();
            const prevUserProfileData = cache.getUserProfileDataCache(authUser.username);

            const optimisticPost = optimisticFactory.createPost(post);

            cache.setPostsCache((data) => produce(data, (draft) => {
                draft?.posts.push(optimisticPost);
            }))
            cache.setUserProfileDataCache((data) => produce(data, (draft) => {
                draft?.userProfileData.posts.push(optimisticPost);
            }), authUser.username);

            return { prevPosts, prevUserProfileData, authUser };
        },
        onError: (error, vars, context) => {
            console.error(error);
            cache.setPostsCache(() => context?.prevPosts);
            if (context?.authUser)
                cache.setUserProfileDataCache(() => context?.prevUserProfileData, context.authUser.username);
        },
        onSettled: (data, error, vars, context) => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ["profile", context?.authUser.username] });
        },

    })
}

export function usePUTUserProfile() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orchesterateProfileUpadate,
        onMutate: async (updateData) => {

            const authUser = cache.getSessionCache()?.user;
            if (!authUser) return;

            await queryClient.cancelQueries({ queryKey: ["session"] });
            await queryClient.cancelQueries({ queryKey: ["profile", authUser.username] });

            const prevSession = cache.getSessionCache();
            const prevProfile = cache.getUserProfileDataCache(authUser.username);

            let secureURL: string | undefined;
            if (updateData.image) {
                secureURL = URL.createObjectURL(updateData.image);
            }

            cache.setSessionCache((data) => {
                if (!data?.user) return { user: null };
                return { ...data, user: { ...data.user, ...updateData, image: secureURL } }
            });

            cache.setUserProfileDataCache((data) => {
                if (data) {
                    return { ...data, userProfileData: { ...data.userProfileData, ...updateData, image: secureURL } }
                }

            }, authUser.username);

            return { prevSession, prevProfile, authUser };
        },
        onError: (error, vars, context) => {
            console.error(error);
            if (context) {
                cache.setSessionCache(() => context.prevSession);
                cache.setUserProfileDataCache(() => context.prevProfile, context.authUser.username);
            }
        },
        onSettled: (data, error, vars, context) => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            queryClient.invalidateQueries({ queryKey: ["profile", context?.authUser.username] });
        }
    })
}


export function useFollowUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: POSTFollowUser,
        onMutate: async (targetId) => {

            await queryClient.cancelQueries({ queryKey: ["follows"] });

            const prevUserFollowsList = cache.getUserFollowsListCache();

            cache.setUserFollowsListCache((data) => produce(data, (draft) => {
                draft?.userFollowsList.push(targetId);
            }))

            return { prevUserFollowsList };
        },
        onError: (error, targetId, context) => {
            console.error(error);
            if (context?.prevUserFollowsList) {
                cache.setUserFollowsListCache(() => context.prevUserFollowsList);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["follows"] });
        }
    })
}

export function useUnfollowUser() {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DELETEFollowUser,
        onMutate: async (targetId) => {

            await queryClient.cancelQueries({ queryKey: ["follows"] });

            const prevUserFollowsList = cache.getUserFollowsListCache();

            cache.setUserFollowsListCache((data) => produce(data, (draft) => {
                const index = draft?.userFollowsList.findIndex(id => id === targetId);
                if (index && index != -1) draft?.userFollowsList.splice(index, 1);
            }))

            return { prevUserFollowsList };
        },
        onError: (error, targetId, context) => {
            console.error(error);
            if (context?.prevUserFollowsList) {
                cache.setUserFollowsListCache(() => context.prevUserFollowsList);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["follows"] });
        }
    })
}