import { useState, type ChangeEvent } from 'react'
import { Heart, MessageCircle, Share2, MoreHorizontal, Film, Send } from 'lucide-react'
import { NavLink } from 'react-router';
import { useLoginModal } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RatingStars from '@/components/social-components/rating-stars';
import { PostActionButton } from '@/components/ui/post-action-button';
import { useSession } from '@/hooks/use-auth-queries';
import { useUserLikedPosts, useUsers } from '@/hooks/use-social-queries';
import defaultAvatar from '/default-avatar.jpg';
import PostComment from './comment';
import type { ResponseSafeUser } from 'moviesclub-shared/auth';
import type { Post } from 'moviesclub-shared/social';
import { useDELETELikePost, usePOSTComment, usePOSTLikePost } from '@/hooks/use-social-mutations';

type postCardProps = {
    user: ResponseSafeUser,
    post: Post
}

export default function PostCard({ user, post }: postCardProps) {

    const { mutate: mutatePostComment } = usePOSTComment();
    const { mutate: mutatePostLike } = usePOSTLikePost();
    const { mutate: mutatePostUnlike } = useDELETELikePost();

    const userLikedPosts = useUserLikedPosts().data;

    const authUser = useSession().data?.user;

    const [comment, setComment] = useState('');

    const { openLogin } = useLoginModal();

    const isLiked = !!(userLikedPosts?.find((p) => p == post.id)) || false;

    async function handleLikePost() {
        if (!authUser) return openLogin();
        (isLiked) ? mutatePostLike(post.id) : mutatePostUnlike(post.id);
    }

    async function handleCommentPost() {
        if (!authUser) return openLogin();

        const content = comment.trim();
        if (!content) return;

        mutatePostComment({ postId: post.id, comment: { content } });
        setComment('');
    }

    return (
        <div className='bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors shadow-sm'>

            <div className='flex justify-between items-start mb-3'>
                <div className='flex gap-3'>
                    <NavLink to={`/social/user/${user.id}`}>
                        <img
                            src={user.image || defaultAvatar}
                            className='w-10 h-10 rounded-full bg-slate-800 object-cover'
                            alt={user.name}
                        />
                    </NavLink>
                    <div>
                        <div className='flex items-center gap-2'>
                            <NavLink to={`/social/user/${user.id}`}>
                                <span className='font-bold text-white'>{user.name}</span>
                                &#32;
                                <span className='text-xs text-slate-500'>{post.createdAt}</span>
                            </NavLink>
                        </div>

                        {post.movieTitle && (
                            <div className='flex items-center gap-2 mt-0.5 text-xs text-slate-400'>
                                <span className='flex items-center gap-1 text-red-400 font-medium'>
                                    <Film className='w-3 h-3' /> {post.movieTitle}
                                </span>
                                {post.rating && <RatingStars rating={post.rating} />}
                            </div>
                        )}
                    </div>
                </div>
                <Button type='button' variant='social-ghost' size='icon-sm'>
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
                <PostActionButton onClick={handleLikePost} Icon={Heart} count={post._count.likedBy} active={isLiked} tone='pink' />
                <PostActionButton Icon={MessageCircle} count={post.comments?.length || 0} tone='blue' />
                <PostActionButton Icon={Share2} tone='green' />
            </div>

            <div className='bg-slate-950/30 rounded-lg p-3 border border-slate-800/50'>
                <div className='space-y-4 mb-4 pl-1'>
                    {post.comments.map((comment) => {
                        return <PostComment key={comment.id} comment={comment} />
                    })}
                </div>

                <div className='flex gap-3 items-center'>
                    <img
                        src={authUser?.image || defaultAvatar}
                        className='w-8 h-8 rounded-full border border-slate-700 bg-slate-800 object-cover'
                        alt="Me"
                    />
                    <div className='relative flex-1 group'>
                        <Input
                            value={comment}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => { setComment(e.target!.value) }}
                            type="text"
                            placeholder="Write a comment..."
                            variant="social"
                        />
                        <Button
                            type='button'
                            variant='input-action'
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