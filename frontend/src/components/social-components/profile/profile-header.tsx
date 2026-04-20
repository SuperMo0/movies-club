import React, { type ChangeEvent, type Dispatch, type RefObject, type SetStateAction } from 'react';
import { Camera, Edit3, UserMinus, UserPlus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import defaultAvatar from '/default-avatar.jpg'
import { useSession } from '@/hooks/use-auth-queries';
import type { ResponseSafeUser } from 'moviesclub-shared/auth';
import ProfileBanner from './Profile-banner';

type ProfileHeaderProps = {
    user: ResponseSafeUser
    isOwner: boolean
    startEditing: () => void;
}

export default function ProfileHeader({ user, isOwner, startEditing }: ProfileHeaderProps) {

    function handleSaveChanges() {
        console.log('mutating profile');
    }
    return (
        <div className='relative mb-24 md:mb-28'>
            <ProfileBanner />
            {/* Profile Info Overlay */}
            <div className='absolute top-full left-0 w-full -translate-y-1/2 md:-translate-y-[40%]'>
                <div className='max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-start md:items-end gap-6'>
                    {/* Avatar */}
                    <div className='relative group shrink-0'>
                        <div className='w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 overflow-hidden bg-slate-800 shadow-xl relative'>
                            <img src={user.image || defaultAvatar} alt={user.name} className='w-full h-full object-cover' />
                        </div>
                    </div>

                    <div className='flex-1 flex flex-row items-end justify-between gap-4 w-full md:w-auto pb-2'>
                        {/* Name and Username */}
                        <div className='text-left mt-2 md:mt-0 flex-1 min-w-0'>
                            <h1 className='text-2xl md:text-3xl font-bold text-white leading-tight truncate'>{user.name}</h1>
                            <p className='text-slate-500 font-medium truncate'>@{user.username}</p>
                        </div>

                        {/* Actions */}
                        <div className='flex gap-2 md:gap-3 shrink-0'>
                            {!isOwner && <button>follow</button>}
                            {isOwner && (
                                <Button
                                    type="button"
                                    onClick={startEditing}
                                    variant="profile-edit"
                                    className="px-4 py-2 text-sm md:text-base h-auto"
                                >
                                    <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}