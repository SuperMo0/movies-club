import PostCard from '@/components/social-components/post-card';
import NewPostEditor from '@/components/social-components/new-post-editor';
import { Button } from '@/components/ui/button';
import type { UserProfileData } from 'moviesclub-shared/social';

type profileContentProps = {
    profileData: UserProfileData,
    isOwner: boolean
}
export default function ProfileContent({ profileData, isOwner }: profileContentProps) {


    return (
        <div className='flex-1'>
            {isOwner && (
                <div className='mb-8'>
                    <NewPostEditor />
                </div>
            )}

            <div className='flex gap-6 border-b border-slate-800 mb-6'>
                <Button type="button" variant="profile-tab-active">
                    Reviews
                </Button>
                <Button type="button" variant="profile-tab">
                    Media
                </Button>
                <Button type="button" variant="profile-tab">
                    Likes
                </Button>
            </div>

            <div className='flex flex-col gap-6'>
                {profileData.posts.length > 0 ? profileData.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                )) : (
                    <div className="text-slate-500 text-center py-10">No posts yet.</div>
                )}
            </div>
        </div>
    );
}