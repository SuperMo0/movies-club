import React from 'react';
import { useSocialProfile, defaultAvatar } from '@/hooks/use-social-profile';

import ProfileImageCropper from '@/components/social-components/profile/profile-image-cropper';
import ProfileHeader from '@/components/social-components/profile/profile-header';
import ProfileSidebar from '@/components/social-components/profile/profile-sidebar';
import ProfileContent from '@/components/social-components/profile/profile-content';

export default function SocialProfile() {
    const { state, refs, actions } = useSocialProfile();
    const { user, showCropper, rawImageForCropper } = state;
    const { setShowCropper, onCropComplete } = actions;

    if (!user) return <div className="h-screen w-full flex items-center justify-center text-white bg-slate-950 text-center">User not found</div>;


    return (
        <>
            <ProfileImageCropper
                showCropper={showCropper}
                setShowCropper={setShowCropper}
                rawImageForCropper={rawImageForCropper}
                onCropComplete={onCropComplete}
            />

            <div className='bg-slate-950 min-h-screen pb-12'>
                <ProfileHeader state={state} refs={refs} actions={actions} defaultAvatar={defaultAvatar} />

                <div className='max-w-4xl mx-auto px-4 md:px-8 mb-8'>
                    <div className='flex flex-col md:flex-row gap-8'>
                        <ProfileSidebar state={state} refs={refs} />
                        <ProfileContent state={state} />
                    </div>
                </div>
            </div>
        </>
    );
}