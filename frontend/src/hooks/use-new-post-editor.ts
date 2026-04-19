import { useState, useRef, type ChangeEvent } from 'react';
import { useSession } from './use-auth-queries';

export function useNewPostEditor() {


    const [showMoviePicker, setShowMoviePicker] = useState(false);

    const [image, setImage] = useState<string | null>(null);

    const authUser = useSession().data?.user;

    const pickerRef = useRef(null);

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
        state: {
            showMoviePicker,
            image,
            authUser,
        },
        refs: {
            pickerRef,
            fileInputRef,
        },
        actions: {
            setShowMoviePicker,
            handleImageUpload,
            removeImage,
        }
    };
}
