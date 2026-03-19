import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import api from '../lib/axios.js';
import { toast } from "react-toastify";
import { useAuthStore } from '@/stores/auth.store.js';
import { enableMapSet } from 'immer'

enableMapSet();

export const useSocialStore = create(immer((set, get) => ({

    users: null,
    allPosts: null,
    userPosts: null,
    likedPosts: null,
    isLoading: true,
    isUploading: false,

    getUsers: async () => {
        if (get().users) return;
        set((state) => { state.isLoading = true; });
        try {
            let response = await api.get('/social/users');
            let users = new Map();
            response.data.users.forEach((u) => {
                users.set(u.id, u);
            });
            set((state) => { state.users = users; });
        } catch (error) {
            console.log(error);
        } finally {
            set((state) => { state.isLoading = false; });
        }
    },

    getLikedPosts: async () => {
        try {
            let result = await api.get('/social/liked');
            const likedPosts = new Set(result.data.likedPosts);
            set((state) => { state.likedPosts = likedPosts; });
        } catch (error) {
            console.log(error);
            toast.error('Error while getting liked posts');
        }
    },

    getPosts: async () => {
        if (get().allPosts) return;
        set((state) => { state.isLoading = true; });
        try {
            let response = await api.get('/social/feed');
            let posts = response.data.posts;

            let userPosts = new Map();
            posts.forEach((p) => {
                if (!userPosts.has(p.authorId))
                    userPosts.set(p.authorId, []);
                userPosts.get(p.authorId).push(p);
            });

            set((state) => {
                state.allPosts = posts;
                state.userPosts = userPosts;
            });
        } catch (error) {
            console.log(error);
        } finally {
            set((state) => { state.isLoading = false; });
        }
    },

    createNewPost: async (formData) => {
        set((state) => { state.isUploading = true; });

        const { authUser } = useAuthStore.getState();

        const content = formData.get('content');
        const imageFile = formData.get('image');
        const movieId = formData.get('movieId');
        const rating = formData.get('rating');

        // Optimistic Post
        const tempId = `temp-${Date.now()}`;
        const optimisticPost = {
            id: tempId,
            content: content,
            image: (imageFile instanceof File) ? URL.createObjectURL(imageFile) : null,
            movieId: movieId,
            rating: rating ? Number(rating) : null,
            createdAt: new Date().toISOString(),
            authorId: authUser.id,
            _count: { likedBy: 0, comments: 0 }
        };

        // SNAPSHOT & UPDATE
        const prevAll = get().allPosts;
        const prevUserPosts = get().userPosts;

        set((state) => {
            state.allPosts.unshift(optimisticPost);

            const authorPosts = state.userPosts.get(authUser.id) || [];
            state.userPosts.set(authUser.id, [optimisticPost, ...authorPosts]);
        });

        try {
            let result = await api.post('/social/post', formData);
            const realPost = result.data.post;

            set((state) => {
                // Swap temp post for real post
                const swapPostIndex = state.allPosts.findIndex(p => p.id === tempId);
                if (swapPostIndex !== -1) {
                    state.allPosts[swapPostIndex] = realPost;
                }

                const authorPosts = state.userPosts.get(authUser.id);
                if (authorPosts) {
                    const swapUserPostIndex = authorPosts.findIndex(p => p.id === tempId);
                    if (swapUserPostIndex !== -1) {
                        authorPosts[swapUserPostIndex] = realPost;
                    }
                }

                state.isUploading = false;
            });

            return { success: true };

        } catch (error) {
            console.log("Upload failed", error);

            set((state) => {
                state.allPosts = prevAll;
                state.userPosts = prevUserPosts;
                state.isUploading = false;
            });

            return { success: false, message: error.message };
        }
    },



    togglePostLike: async (post, action) => {
        const prevLiked = new Set(get().likedPosts);
        const prevAll = get().allPosts;
        const prevUserPosts = get().userPosts;

        set((state) => {
            if (action === 1) {
                state.likedPosts.add(post.id);
            } else {
                state.likedPosts.delete(post.id);
            }

            const targetAllPost = state.allPosts.find(p => p.id === post.id);
            if (targetAllPost) {
                targetAllPost._count.likedBy += action;
            }

            const userPostsArray = state.userPosts.get(post.authorId);
            if (userPostsArray) {
                const targetUserPost = userPostsArray.find(p => p.id === post.id);
                if (targetUserPost) {
                    targetUserPost._count.likedBy += action;
                }
            }
        });

        try {
            if (action === 1) await api.post(`/social/like/${post.id}`);
            else await api.delete(`/social/like/${post.id}`);
            return { success: true, message: 'ok' };
        } catch (error) {
            set((state) => {
                state.likedPosts = prevLiked;
                state.allPosts = prevAll;
                state.userPosts = prevUserPosts;
            });
            return { success: false, message: 'error' };
        }
    },




    commentPost: async (post, content) => {
        const currentUser = useAuthStore.getState().authUser;

        // Optimistic Comment
        const tempId = Date.now();
        const optimisticComment = {
            id: tempId,
            content: content,
            createdAt: new Date().toISOString(),
            authorId: currentUser.id,
            postId: post.id
        };

        // SNAPSHOT 
        const prevAll = get().allPosts;
        const prevUserPosts = get().userPosts;

        //  OPTIMISTIC UPDATE
        set((state) => {
            const targetAllPost = state.allPosts.find(p => p.id === post.id);
            if (targetAllPost) {
                if (!targetAllPost.comments) targetAllPost.comments = [];
                targetAllPost.comments.push(optimisticComment);
            }

            const userPostsArray = state.userPosts.get(post.authorId);
            if (userPostsArray) {
                const targetUserPost = userPostsArray.find(p => p.id === post.id);
                if (targetUserPost) {
                    if (!targetUserPost.comments) targetUserPost.comments = [];
                    targetUserPost.comments.push(optimisticComment);
                }
            }
        });

        try {
            //  API
            const res = await api.post(`social/comment/${post.id}`, { content });
            const realComment = res.data.comment;

            set((state) => {
                const targetAllPost = state.allPosts.find(p => p.id === post.id);
                if (targetAllPost && targetAllPost.comments) {
                    const cIdx = targetAllPost.comments.findIndex(c => c.id === tempId);
                    if (cIdx !== -1) targetAllPost.comments[cIdx] = realComment;
                }

                const userPostsArray = state.userPosts.get(post.authorId);
                if (userPostsArray) {
                    const targetUserPost = userPostsArray.find(p => p.id === post.id);
                    if (targetUserPost && targetUserPost.comments) {
                        const cIdx = targetUserPost.comments.findIndex(c => c.id === tempId);
                        if (cIdx !== -1) targetUserPost.comments[cIdx] = realComment;
                    }
                }
            });

            return { success: true };

        } catch (error) {
            console.log(error);

            console.log("Comment failed");
            set((state) => {
                state.allPosts = prevAll;
                state.userPosts = prevUserPosts;
            });
            return { success: false, message: "Failed to post comment" };
        }
    }
})));