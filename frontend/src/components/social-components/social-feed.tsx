import { useEffect, useRef } from 'react';
import { Clapperboard } from 'lucide-react';
import NewPostEditor from '@/components/social-components/new-post-editor'
import PostCard from './post-card'
import { usePosts } from '@/hooks/use-social-queries';
import PostSkeleton from '../skeletons/post-skeleton';

export default function SocialFeed() {

    const { data: posts, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage } = usePosts();
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Start loading the next page a little before the reader reaches the end of the feed.
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasNextPage || isFetchNextPageError) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry?.isIntersecting && !isFetchingNextPage) fetchNextPage(); },
            { rootMargin: '600px 0px' },
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

    return (
        <div className='flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0'>
            <NewPostEditor />
            <div className='flex flex-col gap-6'>
                {
                    (!posts) ? [1, 2, 3].map((x) => (<PostSkeleton key={x} />))
                        :
                        posts.map((post) => {
                            return <PostCard key={post.id} post={post} />
                        })
                }

                {isFetchingNextPage && [1, 2].map((x) => (<PostSkeleton key={`next-${x}`} />))}

                {isFetchNextPageError && (
                    <div className='flex flex-col items-center gap-3 py-6 text-sm text-slate-400'>
                        Couldn't load more posts.
                        <button
                            onClick={() => fetchNextPage()}
                            className='rounded-full border border-slate-700 px-4 py-1.5 font-medium text-slate-200 transition-colors hover:border-red-500 hover:text-white'
                        >
                            Try again
                        </button>
                    </div>
                )}

                {posts && !hasNextPage && posts.length > 0 && (
                    <div className='flex items-center gap-3 py-4 text-xs font-medium tracking-wider text-slate-500 uppercase'>
                        <div className='h-px grow bg-slate-800' />
                        <Clapperboard className='size-3.5' />
                        You're all caught up
                        <div className='h-px grow bg-slate-800' />
                    </div>
                )}

                <div ref={sentinelRef} aria-hidden='true' />
            </div>
        </div>
    )
}
