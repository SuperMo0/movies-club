import type { Comment } from 'moviesclub-shared/social'
import { useUsers } from '@/hooks/use-social-queries'
import defaultAvatar from '/default-avatar.jpg';
import { Button } from '../ui/button';
export default function PostComment({ comment }: { comment: Comment }) {

    return (
        <div key={comment.id} className='flex gap-3'>
            <img
                src={comment.author?.image || defaultAvatar}
                className='w-7 h-7 rounded-full border border-slate-800 shrink-0 object-cover'
                alt=""
            />
            <div className='flex-1'>
                <div className='bg-slate-800/50 rounded-2xl rounded-tl-none px-3 py-2 inline-block'>
                    <div className='flex items-baseline gap-2'>
                        <span className='text-xs font-bold text-slate-200'>{comment.author?.name}</span>
                    </div>
                    <p className='text-xs text-slate-300 leading-snug mt-0.5'>{comment.content}</p>
                </div>
                <div className='flex gap-3 mt-1 ml-1'>
                    <Button type='button' variant='social-link' className='text-[10px]'>Like</Button>
                    <Button type='button' variant='social-link' className='text-[10px]'>Reply</Button>
                </div>
            </div>
        </div>
    )



}
