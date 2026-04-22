import { useState, useRef, type ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { useSession } from './use-auth-queries';
import { useProfileData } from './use-social-queries';

export const defaultAvatar = "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg";

// todo: refactor this to seperate cropping states from user profile state
export function useSocialProfile() {

    const authUser = useSession().data?.user;
    const [previewImage, setPreviewImage] = useState(authUser?.image);
    const [rawImageForCropper, setRawImageForCropper] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { username } = useParams();
    const { data: profileData, isPending } = useProfileData(username!);

    const isOwner = authUser?.id == profileData?.id || false

    function startEditing() {
        setPreviewImage(authUser?.image || defaultAvatar);
        setIsEditing(true);
    }

    function cancelEditing() {
        setRawImageForCropper(null);
        setPreviewImage(null);
        setIsEditing(false)
    }

    function onFileSelect(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                return;
            }
            if (rawImageForCropper) URL.revokeObjectURL(rawImageForCropper);
            let objectURL = URL.createObjectURL(file);
            setRawImageForCropper(objectURL);
            setShowCropper(true);
        }
    }

    async function onCropComplete(croppedDataUrl: string) {
        setShowCropper(false);
        setRawImageForCropper(null);
        setPreviewImage(croppedDataUrl);
    }

    return {
        state: {
            isPending,
            previewImage,
            rawImageForCropper,
            showCropper,
            isEditing,
            isOwner,
            profileData
        },
        refs: {
            fileInputRef
        },
        actions: {
            startEditing,
            cancelEditing,
            onFileSelect,
            onCropComplete,
            setShowCropper,
        }
    };
}