import { useState, useRef } from 'react';
import { useParams } from 'react-router';
import { useSocialStore } from '@/stores/social.store';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import { useSession } from './use-auth-queries';
import { usePosts, useUsers } from './use-social-queries';

export const defaultAvatar = "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg";

export function useSocialProfile() {

    const { id } = useParams();

    const authUser = useSession().data.user;

    const isOwner = authUser?.id === id;

    const users = useUsers().data;

    const user = users.find((u) => u.id == id);

    const posts = usePosts().data.filter(p => p.authorId == id);

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
        setPreviewImage(authUser?.image || defaultAvatar);
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
        const nameValue = nameRef.current?.value || '';
        const bioValue = bioRef.current?.value || '';

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

    return {
        state: {
            user,
            posts,
            isOwner,
            isEditing,
            isSaving,
            isFollowing,
            previewImage,
            rawImageForCropper,
            showCropper
        },
        refs: {
            nameRef,
            bioRef,
            fileInputRef
        },
        actions: {
            startEditing,
            cancelEditing,
            onFileSelect,
            onCropComplete,
            setShowCropper,
            handleSaveChanges,
            handleFollowToggle
        }
    };
}