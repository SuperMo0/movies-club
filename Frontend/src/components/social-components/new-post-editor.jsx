import { Image as ImageIcon, Film, Send } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SelectedMovieCard, MovieSelectorDropdown } from '@/components/social-components/movie-selectors';
import { ImagePreview } from '@/components/social-components/image-preview';
import { useNewPostEditor } from '@/hooks/use-new-post-editor';

const DEFAULT_AVATAR = "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg"

export default function NewPostEditor() {

    const { state, refs, actions } = useNewPostEditor();

    const { content, selectedMovie, rating, showMoviePicker, image, authUser } = state;
    const { pickerRef, fileInputRef } = refs;
    const { setContent, setSelectedMovie, setRating, setShowMoviePicker, handleImageUpload, removeImage, handlePostSubmit } = actions;

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
                        variant="social"
                    />

                    <ImagePreview image={image} onRemove={removeImage} />

                    {selectedMovie && (
                        <SelectedMovieCard
                            selectedMovie={selectedMovie}
                            rating={rating}
                            setRating={setRating}
                            onClear={() => { setSelectedMovie(null); setRating(0); }}
                        />
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
                                variant='social-icon'
                                onClick={() => fileInputRef.current.click()}
                                data-active={!!image}
                            >
                                <ImageIcon className='w-5 h-5' />
                            </Button>

                            {/* MOVIE SELECTOR */}
                            <div ref={pickerRef} className="relative">
                                <Button
                                    type='button'
                                    variant='social-icon'
                                    onClick={() => setShowMoviePicker(!showMoviePicker)}
                                    data-active={showMoviePicker}
                                >
                                    <Film className='w-5 h-5' />
                                </Button>

                                <MovieSelectorDropdown
                                    isVisible={showMoviePicker}
                                    onClose={() => setShowMoviePicker(false)}
                                    onSelect={setSelectedMovie}
                                />
                            </div>

                        </div>

                        <Button
                            type='button'
                            variant='form'
                            size='pill'
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