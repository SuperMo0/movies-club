import { type ChangeEvent, type Dispatch, type RefObject, type SetStateAction } from 'react';
import { Camera, X, Check, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProfileBanner from './Profile-banner';
import { Controller } from 'react-hook-form';
import { type UpdateProfileBodyClient, type UserProfileData } from 'moviesclub-shared/social';
import { useFormContext } from 'react-hook-form';

type ProfileHeaderProps = {

    profileData: UserProfileData
    previewImage?: string | null
    fileInputRef: RefObject<HTMLInputElement | null>
    isPending: boolean
    actions: {
        startEditing: () => void;
        cancelEditing: () => void;
        onFileSelect: (e: ChangeEvent<HTMLInputElement, Element>) => void;
        onCropComplete: (croppedDataUrl: string) => Promise<void>;
        setShowCropper: Dispatch<SetStateAction<boolean>>;
    }
}

export default function ProfileHeaderEditor({ profileData, previewImage, fileInputRef, isPending, actions }: ProfileHeaderProps) {

    const { cancelEditing, onFileSelect } = actions;

    const form = useFormContext<UpdateProfileBodyClient>();

    return (
        <div className='relative mb-24 md:mb-28'>
            {/* Banner */}
            <ProfileBanner />
            {/* Profile Info Overlay */}
            <div className='absolute top-full left-0 w-full -translate-y-1/2 md:-translate-y-[40%]'>
                <div className='max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-start md:items-end gap-6'>
                    {/* Avatar */}
                    <div className='relative group shrink-0'>
                        <div className='w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 overflow-hidden bg-slate-800 shadow-xl relative'>
                            <img src={previewImage!} alt={profileData.name} className='w-full h-full object-cover' />
                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                                <Camera className="w-8 h-8 text-white opacity-80" />
                                <Controller
                                    name='image'
                                    control={form.control}
                                    render={({ field }) => {
                                        return <input type="file"

                                            className='sr-only'
                                            ref={(node) => { fileInputRef.current = node; field.ref(node) }}
                                            accept="image/*"
                                            onChange={onFileSelect}
                                            onClick={() => { if (fileInputRef.current) fileInputRef.current.value = "" }}
                                        />
                                    }}

                                />
                            </label>
                        </div>
                    </div>

                    <div className='flex-1 flex flex-row items-end justify-between gap-4 w-full md:w-auto pb-2'>
                        {/* Name */}
                        <div className='text-left mt-2 md:mt-0 flex-1 min-w-0'>
                            <div className="flex flex-col gap-2 w-full md:max-w-md">
                                <Input
                                    {...form.register('name')}
                                    defaultValue={profileData.name}
                                    variant="profile-edit"
                                    placeholder="Display Name"
                                    autoComplete='null'
                                />
                            </div>

                        </div>

                        {/* Actions */}
                        <div className='flex gap-2 md:gap-3 shrink-0'>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={cancelEditing}
                                    disabled={isPending}
                                    variant="profile-cancel"
                                    className="px-3 py-2 h-auto"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <Button
                                    type="submit"
                                    form='profile-form'
                                    disabled={isPending}
                                    variant="profile-save"
                                    className="px-4 py-2 text-sm h-auto"
                                >
                                    {isPending ? <Loader className='animate-spin' /> : <><Check className="w-4 h-4" /> Save</>}
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}