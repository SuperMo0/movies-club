import { useSocialProfile } from '@/hooks/use-social-profile-editor';
import ProfileImageCropper from '@/components/social-components/profile/profile-image-cropper';
import ProfileHeader from '@/components/social-components/profile/profile-header';
import ProfileSidebar from '@/components/social-components/profile/profile-sidebar';
import ProfileContent from '@/components/social-components/profile/profile-content';
import ProfileHeaderEditor from '@/components/social-components/profile/profile-header-editor';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileBodyClientSchema, type UpdateProfileBodyClient, type UpdateProfileBodyServer } from 'moviesclub-shared/social';
import { usePUTUserProfile } from '@/hooks/use-social-mutations';

export default function SocialProfile() {

    const { state, refs, actions } = useSocialProfile();
    const { showCropper, rawImageForCropper, isEditing } = state;
    const { onCropComplete, setShowCropper } = actions;

    if (!state.user) return <div className="h-screen w-full flex items-center justify-center text-white bg-slate-950 text-center">User not found</div>;

    const { mutate: mutateProfile } = usePUTUserProfile();

    const form = useForm({
        resolver: zodResolver(updateProfileBodyClientSchema)
    })

    async function handleProfileUpdate(formData: UpdateProfileBodyClient) {
        mutateProfile(formData, {
            onSuccess: actions.cancelEditing
        });
    }

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
                        user={state.user}
                        previewImage={state.previewImage} />
                    : <ProfileHeader
                        isOwner={state.isOwner}
                        startEditing={actions.startEditing}
                        user={state.user}
                        key={state.user.id}
                    />

                }
                <div className='max-w-4xl mx-auto px-4 md:px-8 mb-8'>
                    <div className='flex flex-col md:flex-row gap-8'>
                        <ProfileSidebar isEditing={state.isEditing} posts={state.posts} user={state.user} />
                        <ProfileContent state={state} />
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}