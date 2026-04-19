import { useState, useRef, type ChangeEvent } from 'react';

export function useImagePreview() {

    const [image, setImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        if (image) URL.revokeObjectURL(image);
        setImage(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        fileInputRef,
        image,
        handleImageUpload,
        removeImage,
    };
}
