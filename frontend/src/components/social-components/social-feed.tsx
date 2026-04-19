import NewPostEditor from '@/components/social-components/new-post-editor'
import PostCard from './post-card'
import { useSession } from '@/hooks/use-auth-queries';
import { usePosts, useUsers } from '@/hooks/use-social-queries';
export default function SocialFeed() {

    const { data: posts } = usePosts();

    const { data: users } = useUsers();

    const authUser = useSession().data?.user;

    return (
        <div className='flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0'>
            <NewPostEditor />
            <div className='flex flex-col gap-6'>
                {posts.map((post) => {
                    const isOwner = authUser?.id === post.authorId;
                    const user = isOwner ? authUser : users.find(u => u.id == post.authorId);
                    return <PostCard key={post.id} post={post} user={user!} />
                })}
            </div>
        </div>
    )
}