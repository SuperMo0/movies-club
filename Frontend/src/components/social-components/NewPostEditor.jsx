import React, { useState, useEffect, useRef } from 'react'
import { Image as ImageIcon, Film, Send, Smile, Star, X } from 'lucide-react' // Renamed Image to ImageIcon to avoid conflict with native Image
import { useAuthStore } from '@/stores/auth.store';
import { useLoginModal } from '@/App';
import { useSocialStore } from '@/stores/social.store';
import { useMoviesStore } from '@/stores/movies.store';
import { toast } from 'react-toastify';

export default function NewPostEditor() {

    const [content, setContent] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [showMoviePicker, setShowMoviePicker] = useState(false);

    const [image, setImage] = useState(null);

    const { authUser } = useAuthStore()
    const { createNewPost } = useSocialStore();
    const { todayMovies } = useMoviesStore();

    const pickerRef = useRef(null);
    const fileInputRef = useRef(null);

    const { openLogin } = useLoginModal();

    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowMoviePicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handlePostSubmit() {
        if (!authUser) {
            openLogin();
            return;
        }

        if (!image && !content && !(selectedMovie && rating)) {
            toast.info("Post can't be Empty!");
            return;
        }


        let imageBlob = image ? await (await fetch(image)).blob() : null;

        const formData = new FormData();
        formData.append("content", content);
        formData.append("image", imageBlob);
        formData.append("movieId", selectedMovie);
        formData.append("rating", rating);

        setContent("");
        setImage(null);
        setSelectedMovie(null);
        setRating(0);
        fileInputRef.current.value = null;


        const { success } = await createNewPost(formData);
    }

    function handleImageUpload(e) {
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
    }

    function removeImage() {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className='bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg'>
            <div className='flex gap-4'>
                <img
                    src={authUser?.image || "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg"}
                    className='w-10 h-10 rounded-full bg-slate-800 object-cover'
                    alt="My Avatar"
                />

                <div className='flex-1 flex flex-col gap-3'>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What did you watch today?"
                        className='w-full bg-transparent text-white placeholder:text-slate-500 resize-none outline-none text-base min-h-20'
                    />

                    {image && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full max-h-80 object-cover"
                            />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {selectedMovie && (
                        <div className="flex flex-wrap items-center gap-4 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                                <Film className="w-4 h-4" />
                                {todayMovies.get(selectedMovie)?.title}
                            </div>

                            <div className="h-4 w-px bg-slate-700"></div>

                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-5 h-5 transition-colors ${star <= (hoverRating || rating)
                                                ? 'fill-yellow-500 text-yellow-500'
                                                : 'text-slate-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => { setSelectedMovie(null); setRating(0); }}
                                className="ml-auto text-slate-500 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className='h-px w-full bg-slate-800 my-1'></div>

                    <div className='flex justify-between items-center'>
                        <div className='flex gap-2 relative'>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                            />

                            <button
                                onClick={() => fileInputRef.current.click()}
                                className={`p-2 rounded-full transition-colors ${image ? 'text-red-500 bg-red-500/10' : 'text-slate-400 hover:bg-slate-800 hover:text-red-500'}`}
                            >
                                <ImageIcon className='w-5 h-5' />
                            </button>

                            {/* MOVIE SELECTOR */}
                            <div ref={pickerRef} className="relative">
                                <button
                                    onClick={() => setShowMoviePicker(!showMoviePicker)}
                                    className={`p-2 rounded-full transition-colors flex items-center gap-2 ${showMoviePicker ? 'bg-red-500/20 text-red-500' : 'hover:bg-slate-800 text-slate-400 hover:text-red-500'
                                        }`}
                                >
                                    <Film className='w-5 h-5' />
                                </button>

                                {showMoviePicker && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                                            Recent Releases
                                        </div>
                                        {[...todayMovies.values()].map(movie => (
                                            <button
                                                key={movie.id}
                                                onClick={() => {
                                                    setSelectedMovie(movie.id);
                                                    setShowMoviePicker(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Film className="w-3 h-3 opacity-50" />
                                                {movie.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 transition-colors'
                            onClick={handlePostSubmit}>
                            Post <Send className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}