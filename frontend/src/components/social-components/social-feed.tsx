import NewPostEditor from '@/components/social-components/new-post-editor'
import PostCard from './post-card'
import { usePosts } from '@/hooks/use-social-queries';
import PostSkeleton from '../skeletons/post-skeleton';

export default function SocialFeed() {

    const { data: posts } = usePosts();

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


            </div>
        </div>
    )
}