import { useState, useRef, useEffect } from 'react';
import { useSocialStore } from '@/stores/social.store';
import { useLoginModal } from '@/App';
import { toast } from 'react-toastify';
import { useSession } from './use-auth-queries';

export function useNewPostEditor() {
    const [content, setContent] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [rating, setRating] = useState(0);
    const [showMoviePicker, setShowMoviePicker] = useState(false);
    const [image, setImage] = useState(null);

    const createNewPost = useSocialStore(s => s.createNewPost);
    const { openLogin } = useLoginModal();

    const { data: session } = useSession();
    const authUser = session.user;

    const pickerRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowMoviePicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
                setImage(compressedDataUrl);
            };
        };

        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePostSubmit = async () => {
        if (!authUser) {
            openLogin();
            return;
        }

        if (!image && !content.trim() && !(selectedMovie && rating)) {
            toast.info("Post can't be Empty!");
            return;
        }

        const formData = new FormData();

        if (image) {
            const imageBlob = await (await fetch(image)).blob();
            formData.append("image", imageBlob);
        }

        if (content.trim()) formData.append("content", content.trim());
        if (selectedMovie) formData.append("movieId", selectedMovie);
        if (rating > 0) formData.append("rating", String(rating));

        setContent("");
        setImage(null);
        setSelectedMovie(null);
        setRating(0);
        if (fileInputRef.current) fileInputRef.current.value = null;

        await createNewPost(formData);
    };

    return {
        state: {
            content,
            selectedMovie,
            rating,
            showMoviePicker,
            image,
            authUser,
        },
        refs: {
            pickerRef,
            fileInputRef,
        },
        actions: {
            setContent,
            setSelectedMovie,
            setRating,
            setShowMoviePicker,
            handleImageUpload,
            removeImage,
            handlePostSubmit,
        }
    };
}
