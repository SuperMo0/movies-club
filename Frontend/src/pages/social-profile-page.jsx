import React, { useEffect, useState, useRef } from 'react'
import PostCard from '@/components/social-components/post-card';
import NewPostEditor from '@/components/social-components/new-post-editor';
import Cropper from '@/components/social-components/cropper';
import { MapPin, Calendar, Edit3, Link as LinkIcon, Camera, X, Check, UserPlus, UserMinus } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store';
import { useParams } from 'react-router';
import { useSocialStore } from '@/stores/social.store';
import api from '@/lib/axios';
import { toast } from 'react-toastify';

const defaultAvatar = "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg";
export default function SocialProfile() {

    const { authUser, check } = useAuthStore()
    const { id } = useParams();

    const { users, userPosts } = useSocialStore();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [isFollowing, setIsFollowing] = useState(false);

    const nameRef = useRef(null);
    const bioRef = useRef(null);
    const fileInputRef = useRef(null);


    const [previewImage, setPreviewImage] = useState(authUser?.image);
    const [imageBlob, setImageBlob] = useState(null);
    const [rawImageForCropper, setRawImageForCropper] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    function startEditing() {
        setPreviewImage(authUser.image || defaultAvatar);
        setImageBlob(null);
        setIsEditing(true);
    }

    function cancelEditing() {
        setIsEditing(false);
        setRawImageForCropper(null);
        setImageBlob(null);
        setPreviewImage(null);
    }

    function onFileSelect(e) {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setRawImageForCropper(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    }

    async function onCropComplete(croppedDataUrl) {
        setShowCropper(false);
        setRawImageForCropper(null);

        if (croppedDataUrl) {
            setPreviewImage(croppedDataUrl);
            try {
                const blob = await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = croppedDataUrl;

                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;

                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(
                            (blob) => {
                                if (blob) resolve(blob);
                                else reject(new Error('Canvas to Blob failed'));
                            },
                            'image/jpeg',
                            0.1
                        );
                    };

                    img.onerror = (err) => reject(err);
                });

                setImageBlob(blob);

            } catch (error) {
                console.error("Error processing crop:", error);
                toast.error("Failed to process image");
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleSaveChanges() {
        const nameValue = nameRef.current.value;
        const bioValue = bioRef.current.value;

        if (!nameValue.trim()) return toast.error("Name cannot be empty");

        setIsSaving(true);
        const toastId = toast.loading("Updating profile...");

        try {
            const formData = new FormData();
            formData.append('name', nameValue);
            formData.append('bio', bioValue);

            if (imageBlob) {
                formData.append('image', imageBlob, 'profile.jpg');
            }

            await api.put('/social/profile', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            await check();
            toast.update(toastId, { render: "Profile updated!", type: "success", isLoading: false, autoClose: 2000 });
            setIsEditing(false);

        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Update failed", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsSaving(false);
        }
    }

    function handleFollowToggle() {
        setIsFollowing(!isFollowing);
    }

    const isOwner = authUser?.id === id;
    const user = isOwner ? authUser : users?.get(id);
    const posts = userPosts?.get(id) || [];

    if (!user) return <div className="h-screen w-full flex items-center justify-center text-white bg-slate-950 text-center">User not found</div>;

    const stats = [
        { label: 'Reviews', value: posts.length },
        { label: 'Followers', value: user._count?.followedBy || 0 },
        { label: 'Following', value: user._count?.following || 0 },
    ];

    return (
        <>
            {showCropper && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
                    <div className='bg-slate-900 p-6 rounded-xl w-full max-w-lg'>
                        <Cropper image={rawImageForCropper} closeModal={onCropComplete} />
                        <button
                            onClick={() => setShowCropper(false)}
                            className="mt-4 w-full py-2 text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className='bg-slate-950 min-h-screen pb-12'>
                <div className='relative mb-24 md:mb-28'>
                    <div className='h-48 md:h-64 w-full bg-slate-800 overflow-hidden relative'>
                        <img
                            className='w-full h-full object-cover opacity-60'
                            src={"https://wallpapercave.com/wp/wp10021077.jpg"}
                            alt="Banner"
                        />
                        <div className='absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent'></div>
                    </div>

                    <div className='absolute top-full left-0 w-full -translate-y-1/2 md:-translate-y-[40%]'>
                        <div className='max-w-4xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-start md:items-end gap-6'>

                            <div className='relative group shrink-0'>
                                <div className='w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-slate-950 overflow-hidden bg-slate-800 shadow-xl relative'>
                                    <img
                                        className='w-full h-full object-cover'
                                        src={isEditing ? previewImage : (user.image || defaultAvatar)}
                                        alt={user.name}
                                    />
                                    {isEditing && (
                                        <div
                                            onClick={() => fileInputRef.current.click()}
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

                                <div className='text-left mt-2 md:mt-0 flex-1 min-w-0'>
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2 w-full md:max-w-md">
                                            <input
                                                ref={nameRef}
                                                defaultValue={user.name}
                                                className="bg-slate-900 border border-slate-700 text-white text-lg md:text-2xl font-bold px-3 py-1 rounded focus:outline-none focus:border-red-500 w-full"
                                                placeholder="Display Name"
                                            />
                                            <input
                                                disabled
                                                value={'@' + user.username}
                                                className="bg-transparent text-slate-500 font-medium px-3 text-sm border-none cursor-not-allowed w-full"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className='text-2xl md:text-3xl font-bold text-white leading-tight truncate'>{user.name}</h1>
                                            <p className='text-slate-500 font-medium truncate'>@{user.username}</p>
                                        </>
                                    )}
                                </div>

                                {/* Buttons Container - Flex Row by default now */}
                                <div className='flex gap-2 md:gap-3 shrink-0'>
                                    {!isOwner && (
                                        <button
                                            onClick={handleFollowToggle}
                                            className={`
                                                font-semibold px-4 md:px-6 py-2 rounded-full transition-colors shadow-lg flex items-center gap-2 text-sm md:text-base
                                                ${isFollowing
                                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                                    : 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20'}
                                            `}
                                        >
                                            {isFollowing ? (
                                                <><UserMinus className="w-4 h-4" /> <span className="hidden sm:inline">Unfollow</span></>
                                            ) : (
                                                <><UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Follow</span></>
                                            )}
                                        </button>
                                    )}

                                    {isOwner && !isEditing && (
                                        <button
                                            onClick={startEditing}
                                            className='bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-full transition-colors flex items-center gap-2 text-sm md:text-base'
                                        >
                                            <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
                                        </button>
                                    )}

                                    {isOwner && isEditing && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={cancelEditing}
                                                disabled={isSaving}
                                                className='bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-medium px-3 py-2 rounded-full transition-colors'
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleSaveChanges}
                                                disabled={isSaving}
                                                className='bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-green-900/20 text-sm'
                                            >
                                                {isSaving ? "..." : <><Check className="w-4 h-4" /> Save</>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='max-w-4xl mx-auto px-4 md:px-8 mb-8'>
                    <div className='flex flex-col md:flex-row gap-8'>
                        <div className='w-full md:w-1/3 flex flex-col gap-6'>
                            <div>
                                {isEditing ? (
                                    <textarea
                                        ref={bioRef}
                                        defaultValue={user.bio || ""}
                                        className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded p-3 h-32 focus:outline-none focus:border-red-500 resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className='text-slate-300 leading-relaxed text-sm md:text-base'>
                                        {user.bio || "No bio yet."}
                                    </p>
                                )}

                                <div className='mt-4 flex flex-col gap-2 text-sm text-slate-500'>
                                    <div className='flex items-center gap-2'>
                                        <MapPin className='w-4 h-4' /> Egypt
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <LinkIcon className='w-4 h-4' /> <a href="#" className='text-red-400 hover:underline'>letterboxd.com/{user.username}</a>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Calendar className='w-4 h-4' /> {`Joined ${user.joinedAt.slice(0, 10)}`}
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-between md:justify-start md:gap-8 border-y border-slate-800 py-4'>
                                {stats.map((stat) => (
                                    <div key={stat.label} className='text-center md:text-left'>
                                        <span className='block text-xl font-bold text-white'>{stat.value}</span>
                                        <span className='text-xs text-slate-500 uppercase tracking-wide'>{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='flex-1'>
                            {isOwner && (
                                <div className='mb-8'>
                                    <NewPostEditor />
                                </div>
                            )}

                            <div className='flex gap-6 border-b border-slate-800 mb-6'>
                                <button className='pb-3 text-red-500 border-b-2 border-red-500 font-medium'>
                                    Reviews
                                </button>
                                <button className='pb-3 text-slate-500 hover:text-slate-300 font-medium transition-colors'>
                                    Media
                                </button>
                                <button className='pb-3 text-slate-500 hover:text-slate-300 font-medium transition-colors'>
                                    Likes
                                </button>
                            </div>

                            <div className='flex flex-col gap-6'>
                                {posts.length > 0 ? posts.map((post) => (
                                    <PostCard key={post.id} post={post} user={user} />
                                )) : (
                                    <div className="text-slate-500 text-center py-10">No posts yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}