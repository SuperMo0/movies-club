import React from 'react';
import { Camera, Edit3, UserMinus, UserPlus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const defaultBanner = "https://wallpapercave.com/wp/wp10021077.jpg";

export default function ProfileHeader({ state, refs, actions, defaultAvatar }) {
    const { user, isOwner, isEditing, isSaving, isFollowing, previewImage } = state;
    const { nameRef, fileInputRef } = refs;
    const { startEditing, cancelEditing, handleSaveChanges, handleFollowToggle, onFileSelect } = actions;

    return (
        <div className='relative mb-24 md:mb-28'>
            {/* Banner */}
            <div className='h-48 md:h-64 w-full bg-slate-800 overflow-hidden relative'>
                <img
                    className='w-full h-full object-cover opacity-60'
                    src={defaultBanner}
                    alt="Banner"
                />
                <div className='absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent'></div>
            </div>

            {/* Profile Info Overlay */}
            <div className='absolute top-full left-0 w-full -translate-y-1/2 md:-translate-y-[40%]'>
                <div className='max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-start md:items-end gap-6'>
                    {/* Avatar */}
                    <div className='relative group shrink-0'>
                        <div className='w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 overflow-hidden bg-slate-800 shadow-xl relative'>
                            <img
                                className='w-full h-full object-cover'
                                src={isEditing ? previewImage : (user.image || defaultAvatar)}
                                alt={user.name}
                            />
                            {isEditing && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                                >
                                    <Camera className="w-8 h-8 text-white opacity-80" />
                                    <input
                                        type="file"
                                        hidden
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={onFileSelect}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex-1 flex flex-row items-end justify-between gap-4 w-full md:w-auto pb-2'>
                        {/* Name and Username */}
                        <div className='text-left mt-2 md:mt-0 flex-1 min-w-0'>
                            {isEditing ? (
                                <div className="flex flex-col gap-2 w-full md:max-w-md">
                                    <Input
                                        ref={nameRef}
                                        defaultValue={user.name}
                                        variant="profile-edit"
                                        placeholder="Display Name"
                                    />
                                    <Input
                                        disabled
                                        value={'@' + user.username}
                                        variant="profile-disabled"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className='text-2xl md:text-3xl font-bold text-white leading-tight truncate'>{user.name}</h1>
                                    <p className='text-slate-500 font-medium truncate'>@{user.username}</p>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className='flex gap-2 md:gap-3 shrink-0'>
                            {!isOwner && (
                                <Button
                                    type="button"
                                    onClick={handleFollowToggle}
                                    variant={isFollowing ? 'profile-follow-active' : 'profile-follow'}
                                    className="px-4 md:px-6 py-2 text-sm md:text-base h-auto"
                                >
                                    {isFollowing ? (
                                        <><UserMinus className="w-4 h-4" /> <span className="hidden sm:inline">Unfollow</span></>
                                    ) : (
                                        <><UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Follow</span></>
                                    )}
                                </Button>
                            )}
                            {isOwner && !isEditing && (
                                <Button
                                    type="button"
                                    onClick={startEditing}
                                    variant="profile-edit"
                                    className="px-4 py-2 text-sm md:text-base h-auto"
                                >
                                    <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                                </Button>
                            )}
                            {isOwner && isEditing && (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={cancelEditing}
                                        disabled={isSaving}
                                        variant="profile-cancel"
                                        className="px-3 py-2 h-auto"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleSaveChanges}
                                        disabled={isSaving}
                                        variant="profile-save"
                                        className="px-4 py-2 text-sm h-auto"
                                    >
                                        {isSaving ? "..." : <><Check className="w-4 h-4" /> Save</>}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}