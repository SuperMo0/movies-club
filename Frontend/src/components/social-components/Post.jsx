import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2, Film, Star, Send } from 'lucide-react'
import { useSocialStore } from '@/stores/social.store';
import { useMoviesStore } from '@/stores/movies.store';
import { useAuthStore } from '@/stores/auth.store';
import { NavLink } from 'react-router';
import { useLoginModal } from '@/App';

export default function Post({ user, post }) {

    const { likedPosts, likePost, unLikePost, commentPost } = useSocialStore();

    const [comment, setComment] = useState('');
    const { users } = useSocialStore();
    const { allMovies } = useMoviesStore();
    const { authUser } = useAuthStore()
    const { openLogin } = useLoginModal();

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`}
            />
        ));
    };


    const isLiked = (likedPosts?.has(post.id));
    const movie = allMovies.get(post.movieId) || allMovies.get("2094918");  // this will break because we are not saving movies to the data base 

    async function handleLikePost() {
        if (!authUser) {
            openLogin();
            return;
        }
        if (isLiked) {
            const { success, message } = await unLikePost(post);
        }
        else {
            const { success, message } = await likePost(post);
        }
    }

    async function handleCommentPost() {
        if (!authUser) {
            openLogin();
            return;
        }
        commentPost(post, comment);
    }

    return (
        <div className='bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors shadow-sm'>

            <div className='flex justify-between items-start mb-3'>
                <div className='flex gap-3'>
                    <NavLink to={`/social/user/${user.id}`}>
                        <img
                            src={user.image || "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg"}
                            className='w-10 h-10 rounded-full bg-slate-800 object-cover'
                            alt={user.name}
                        />
                    </NavLink>
                    <div>
                        <div className='flex items-center gap-2'>
                            <NavLink to={`/social/user/${user.id}`}>
                                <span className='font-bold text-white'>{user.name}</span>
                                &#32;
                                <span className='text-xs text-slate-500'>{post.createdAt.slice(0, 10)}</span>
                            </NavLink>
                        </div>


                        {movie && (
                            <div className='flex items-center gap-2 mt-0.5 text-xs text-slate-400'>
                                <span className='flex items-center gap-1 text-red-400 font-medium'>
                                    <Film className='w-3 h-3' /> {movie.title}
                                </span>
                                <div className='flex gap-0.5'>{renderStars(post.rating)}</div>
                            </div>
                        )}
                    </div>
                </div>
                <button className='text-slate-500 hover:text-white'><MoreHorizontal className='w-5 h-5' /></button>
            </div>

            <p className='text-slate-300 leading-relaxed mb-3'>{post.content}</p>

            {post.image && (
                <div className='mb-4 rounded-xl overflow-hidden border border-slate-800'>
                    <img src={post.image} className='w-full object-cover max-h-100' alt="Post content" />
                </div>
            )}

            <div className='flex items-center gap-6 text-slate-500 py-3 border-t border-slate-800/50 mb-1'>
                <button
                    onClick={handleLikePost}
                    className={`flex items-center gap-2 text-sm group ${isLiked ? 'text-pink-600' : 'hover:text-pink-500'}`}
                >
                    <div className={`p-2 rounded-full group-hover:bg-pink-500/10 transition-colors`}>
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span>{post._count.likedBy}</span>
                </button>

                <button className='flex items-center gap-2 text-sm group hover:text-blue-400'>
                    <div className='p-2 rounded-full group-hover:bg-blue-400/10 transition-colors'>
                        <MessageCircle className='w-5 h-5' />
                    </div>
                    <span>{post.comments?.length || 0}</span>
                </button>

                <button className='flex items-center gap-2 text-sm group hover:text-green-400'>
                    <div className='p-2 rounded-full group-hover:bg-green-400/10 transition-colors'>
                        <Share2 className='w-5 h-5' />
                    </div>
                </button>
            </div>

            <div className='bg-slate-950/30 rounded-lg p-3 border border-slate-800/50'>

                {post.comments && post.comments.length > 0 && (
                    <div className='space-y-4 mb-4 pl-1'>
                        {post.comments.map((comment) => (
                            <div key={comment.id} className='flex gap-3'>
                                <img
                                    src={users.get(comment.authorId).image || "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg"}
                                    className='w-7 h-7 rounded-full border border-slate-800 shrink-0 object-cover'
                                    alt=""
                                />
                                <div className='flex-1'>
                                    <div className='bg-slate-800/50 rounded-2xl rounded-tl-none px-3 py-2 inline-block'>
                                        <div className='flex items-baseline gap-2'>
                                            <span className='text-xs font-bold text-slate-200'>{users.get(comment.authorId).name}</span>
                                        </div>
                                        <p className='text-xs text-slate-300 leading-snug mt-0.5'>{comment.content}</p>
                                    </div>
                                    <div className='flex gap-3 mt-1 ml-1 text-[10px] text-slate-500'>
                                        <button className='hover:text-slate-300'>Like</button>
                                        <button className='hover:text-slate-300'>Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                <div className='flex gap-3 items-center'>
                    <img
                        src={authUser?.image || "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg"}
                        className='w-8 h-8 rounded-full border border-slate-700 bg-slate-800 object-cover'
                        alt="Me"
                    />
                    <div className='relative flex-1 group'>
                        <input
                            value={comment}
                            onChange={(e) => { setComment(e.target.value) }}
                            type="text"
                            placeholder="Write a comment..."
                            className='w-full bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 rounded-full px-4 py-2 focus:outline-none focus:border-slate-600 focus:bg-slate-900 transition-all'
                        />
                        <button className='absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-focus-within:opacity-100'
                            onClick={handleCommentPost}>
                            <Send className='w-3.5 h-3.5' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}