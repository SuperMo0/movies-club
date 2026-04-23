import { useSocialProfile } from '@/hooks/use-social-profile-editor';
import ProfileImageCropper from '@/components/social-components/profile/profile-image-cropper';
import ProfileHeader from '@/components/social-components/profile/profile-header';
import ProfileSidebar from '@/components/social-components/profile/profile-sidebar';
import ProfileContent from '@/components/social-components/profile/profile-content';
import ProfileHeaderEditor from '@/components/social-components/profile/profile-header-editor';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileBodyClientSchema, type UpdateProfileBodyClient } from 'moviesclub-shared/social';
import { usePUTUserProfile } from '@/hooks/use-social-mutations';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function SocialProfile() {

    const { state, refs, actions } = useSocialProfile();
    const { showCropper, rawImageForCropper, isEditing } = state;
    const { onCropComplete, setShowCropper } = actions;


    const { mutate: mutateProfile, isPending } = usePUTUserProfile();

    const form = useForm({
        resolver: zodResolver(updateProfileBodyClientSchema)
    })

    async function handleProfileUpdate(formData: UpdateProfileBodyClient) {
        mutateProfile(formData, {
            onSuccess: actions.cancelEditing
        });
    }

    if (!state.profileData) return <LoadingScreen message='loading user profile...'></LoadingScreen>;

    return (
        <FormProvider {...form} >
            <form onSubmit={form.handleSubmit(handleProfileUpdate)} id='profile-form' />
            <ProfileImageCropper
                showCropper={showCropper}
                setShowCropper={setShowCropper}
                rawImageForCropper={rawImageForCropper}
                onCropComplete={onCropComplete}
            />
            <div className='bg-slate-950 min-h-screen pb-12'>
                {isEditing ?
                    <ProfileHeaderEditor
                        actions={actions}
                        fileInputRef={refs.fileInputRef}
                        profileData={state.profileData}
                        previewImage={state.previewImage}
                        isPending={isPending}
                    />

                    : <ProfileHeader
                        isOwner={state.isOwner}
                        startEditing={actions.startEditing}
                        profileData={state.profileData}
                    />

                }
                <div className='max-w-4xl mx-auto px-4 md:px-8 mb-8'>
                    <div className='flex flex-col md:flex-row gap-8'>
                        <ProfileSidebar isEditing={state.isEditing} profileData={state.profileData} />
                        <ProfileContent profileData={state.profileData} isOwner={state.isOwner} />
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}