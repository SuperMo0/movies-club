import { useState } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, Film, Send } from 'lucide-react'
import { useSocialStore } from '@/stores/social.store';
import { useMoviesStore } from '@/stores/movies.store';
import { useAuthStore } from '@/stores/auth.store';
import { NavLink } from 'react-router';
import { useLoginModal } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RatingStars from '@/components/social-components/rating-stars';

const DEFAULT_AVATAR = "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg"

function PostActionButton({ onClick, icon: Icon, count, active = false, tone = 'slate' }) {
    const toneClasses = {
        pink: active ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500',
        blue: 'text-slate-500 hover:text-blue-400',
        green: 'text-slate-500 hover:text-green-400',
        slate: 'text-slate-500 hover:text-slate-300'
    }

    const bubbleClasses = {
        pink: 'group-hover:bg-pink-500/10',
        blue: 'group-hover:bg-blue-400/10',
        green: 'group-hover:bg-green-400/10',
        slate: 'group-hover:bg-slate-700/40'
    }

    return (
        <Button
            type='button'
            variant='ghost'
            onClick={onClick}
            className={`group h-auto border-none bg-transparent px-0 py-0 text-sm ${toneClasses[tone] || toneClasses.slate}`}
        >
            <span className={`rounded-full p-2 transition-colors ${bubbleClasses[tone] || bubbleClasses.slate}`}>
                <Icon className={`h-5 w-5 ${active ? 'fill-current' : ''}`} />
            </span>
            {typeof count === 'number' && <span>{count}</span>}
        </Button>
    )
}

export default function PostCard({ user, post }) {

    const { likedPosts, likePost, unLikePost, commentPost } = useSocialStore();

    const [comment, setComment] = useState('');
    const { users } = useSocialStore();
    const { allMovies } = useMoviesStore();
    const { authUser } = useAuthStore()
    const { openLogin } = useLoginModal();

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

        const content = comment.trim();
        if (!content) return;

        await commentPost(post, content);
        setComment('');
    }

    return (
        <div className='bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors shadow-sm'>

            <div className='flex justify-between items-start mb-3'>
                <div className='flex gap-3'>
                    <NavLink to={`/social/user/${user.id}`}>
                        <img
                            src={user.image || DEFAULT_AVATAR}
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
                                <RatingStars rating={post.rating} />
                            </div>
                        )}
                    </div>
                </div>
                <Button type='button' variant='ghost' size='icon' className='h-8 w-8 border-none bg-transparent text-slate-500 hover:bg-slate-800/50 hover:text-white'>
                    <MoreHorizontal className='w-5 h-5' />
                </Button>
            </div>

            <p className='text-slate-300 leading-relaxed mb-3'>{post.content}</p>

            {post.image && (
                <div className='mb-4 rounded-xl overflow-hidden border border-slate-800'>
                    <img src={post.image} className='w-full object-cover max-h-100' alt="Post content" />
                </div>
            )}

            <div className='flex items-center gap-6 text-slate-500 py-3 border-t border-slate-800/50 mb-1'>
                <PostActionButton onClick={handleLikePost} icon={Heart} count={post._count.likedBy} active={isLiked} tone='pink' />
                <PostActionButton icon={MessageCircle} count={post.comments?.length || 0} tone='blue' />
                <PostActionButton icon={Share2} tone='green' />
            </div>

            <div className='bg-slate-950/30 rounded-lg p-3 border border-slate-800/50'>

                {post.comments && post.comments.length > 0 && (
                    <div className='space-y-4 mb-4 pl-1'>
                        {post.comments.map((comment) => (
                            <div key={comment.id} className='flex gap-3'>
                                <img
                                    src={users.get(comment.authorId).image || DEFAULT_AVATAR}
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
                                        <Button type='button' variant='ghost' className='h-auto border-none bg-transparent p-0 text-[10px] text-slate-500 hover:text-slate-300'>Like</Button>
                                        <Button type='button' variant='ghost' className='h-auto border-none bg-transparent p-0 text-[10px] text-slate-500 hover:text-slate-300'>Reply</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                <div className='flex gap-3 items-center'>
                    <img
                        src={authUser?.image || DEFAULT_AVATAR}
                        className='w-8 h-8 rounded-full border border-slate-700 bg-slate-800 object-cover'
                        alt="Me"
                    />
                    <div className='relative flex-1 group'>
                        <Input
                            value={comment}
                            onChange={(e) => { setComment(e.target.value) }}
                            type="text"
                            placeholder="Write a comment..."
                            className='h-10 rounded-full border-slate-800 bg-slate-900 px-4 text-sm text-white placeholder:text-slate-600 focus:border-slate-600 focus:bg-slate-900'
                        />
                        <Button
                            type='button'
                            variant='ghost'
                            className='absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border-none bg-transparent p-0 text-slate-500 opacity-0 transition-colors group-focus-within:opacity-100 hover:bg-red-500/10 hover:text-red-500'
                            onClick={handleCommentPost}
                            disabled={!comment.trim()}
                        >
                            <Send className='w-3.5 h-3.5' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}