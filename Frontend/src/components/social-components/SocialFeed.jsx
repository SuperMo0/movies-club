import React from 'react'
import NewPostEditor from '@/components/social-components/NewPostEditor'
import Post from './Post'
import { useSocialStore } from '@/stores/social.store';
import { useAuthStore } from '@/stores/auth.store';

export default function SocialFeed() {

    const { users, allPosts } = useSocialStore();

    const { authUser } = useAuthStore();

    return (
        <div className='flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0'>
            <NewPostEditor />
            <div className='flex flex-col gap-6'>
                {allPosts.map((post) => {
                    const isOwner = authUser?.id === post.authorId;
                    const user = isOwner ? authUser : users.get(post.authorId);
                    return <Post key={post.id} post={post} user={user} />
                })}
            </div>
        </div>
    )
}