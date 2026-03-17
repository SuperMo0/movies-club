import { useState, useEffect, useRef } from 'react'
import { Image as ImageIcon, Film, Send, Star, X } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store';
import { useLoginModal } from '@/App';
import { useSocialStore } from '@/stores/social.store';
import { useMoviesStore } from '@/stores/movies.store';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const DEFAULT_AVATAR = "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg"
const RATING_SCALE = [1, 2, 3, 4, 5]

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

        if (!image && !content.trim() && !(selectedMovie && rating)) {
            toast.info("Post can't be Empty!");
            return;
        }

        const imageBlob = image ? await (await fetch(image)).blob() : null;

        const formData = new FormData();
        if (content.trim()) formData.append("content", content.trim());
        if (imageBlob) formData.append("image", imageBlob);
        if (selectedMovie) formData.append("movieId", selectedMovie);
        if (rating > 0) formData.append("rating", String(rating));

        setContent("");
        setImage(null);
        setSelectedMovie(null);
        setRating(0);
        fileInputRef.current.value = null;

        await createNewPost(formData);
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
                    src={authUser?.image || DEFAULT_AVATAR}
                    className='w-10 h-10 rounded-full bg-slate-800 object-cover'
                    alt="My Avatar"
                />

                <div className='flex-1 flex flex-col gap-3'>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What did you watch today?"
                        className='min-h-20 resize-none border-none bg-transparent px-0 text-base text-white placeholder:text-slate-500 shadow-none focus-visible:ring-0'
                    />

                    {image && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full max-h-80 object-cover"
                            />
                            <Button
                                type='button'
                                variant='ghost'
                                onClick={removeImage}
                                className="absolute top-2 right-2 h-8 w-8 rounded-full border-none bg-black/60 p-0 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/80 group-hover:opacity-100"
                            >
                                <X className="w-4 h-4" />
                            </Button>
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
                                {RATING_SCALE.map((star) => (
                                    <Button
                                        key={star}
                                        type='button'
                                        variant='ghost'
                                        size='icon-sm'
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="h-8 w-8 rounded-full border-none bg-transparent p-0 transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-5 h-5 transition-colors ${star <= (hoverRating || rating)
                                                ? 'fill-yellow-500 text-yellow-500'
                                                : 'text-slate-600'
                                                }`}
                                        />
                                    </Button>
                                ))}
                            </div>

                            <Button
                                type='button'
                                variant='ghost'
                                onClick={() => { setSelectedMovie(null); setRating(0); }}
                                className="ml-auto h-7 w-7 rounded-full border-none bg-transparent p-0 text-slate-500 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </Button>
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

                            <Button
                                type='button'
                                variant='ghost'
                                onClick={() => fileInputRef.current.click()}
                                className={`h-9 w-9 rounded-full border-none p-0 transition-colors ${image ? 'bg-red-500/10 text-red-500' : 'text-slate-400 hover:bg-slate-800 hover:text-red-500'}`}
                            >
                                <ImageIcon className='w-5 h-5' />
                            </Button>

                            {/* MOVIE SELECTOR */}
                            <div ref={pickerRef} className="relative">
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => setShowMoviePicker(!showMoviePicker)}
                                    className={`h-9 w-9 rounded-full border-none p-0 transition-colors ${showMoviePicker ? 'bg-red-500/20 text-red-500' : 'text-slate-400 hover:bg-slate-800 hover:text-red-500'
                                        }`}
                                >
                                    <Film className='w-5 h-5' />
                                </Button>

                                {showMoviePicker && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                                            Recent Releases
                                        </div>
                                        {[...todayMovies.values()].map(movie => (
                                            <Button
                                                key={movie.id}
                                                type='button'
                                                variant='ghost'
                                                onClick={() => {
                                                    setSelectedMovie(movie.id);
                                                    setShowMoviePicker(false);
                                                }}
                                                className="h-auto w-full justify-start rounded-none border-none px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-red-600 hover:text-white"
                                            >
                                                <Film className="w-3 h-3 opacity-50" />
                                                {movie.title}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        <Button
                            type='button'
                            variant='form'
                            className='rounded-full px-6 py-2'
                            onClick={handlePostSubmit}
                        >
                            Post <Send className='w-4 h-4' />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}