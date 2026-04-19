import { Image as ImageIcon, Film, Send } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SelectedMovieCard, MovieSelectorDropdown } from '@/components/social-components/movie-selectors';
import { ImagePreview } from '@/components/social-components/image-preview';
import { useNewPostEditor } from '@/hooks/use-new-post-editor';
import defaultAvatar from '/default-avatar.jpg';
import type { Movie } from 'moviesclub-shared/movies';
import { useState, type ChangeEvent } from 'react';
import { usePOSTPost } from '@/hooks/use-social-mutations';
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostBodySchema, type createPostBody } from 'moviesclub-shared/social';

export default function NewPostEditor() {

    const { state, refs, actions } = useNewPostEditor();
    const { showMoviePicker, image, authUser } = state;
    const { pickerRef, fileInputRef } = refs;
    const { setShowMoviePicker, handleImageUpload, removeImage } = actions;

    const form = useForm<createPostBody>({
        resolver: zodResolver(createPostBodySchema),
        defaultValues: {
            content: "",
            movieTitle: "",
            rating: null,
        }
    })

    const selectedMovie = form.watch('movieTitle');

    const { mutate: mutatePosts } = usePOSTPost();

    function handlePostSubmit(data: createPostBody) {
        console.log(data);
    }

    return (
        <form onSubmit={form.handleSubmit(handlePostSubmit)}>
            <div className='bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg'>
                <div className='flex gap-4'>
                    <img
                        src={authUser?.image || defaultAvatar}
                        className='w-10 h-10 rounded-full bg-slate-800 object-cover'
                        alt="My Avatar"
                    />
                    <div className='flex-1 flex flex-col gap-3'>
                        <Textarea
                            {...form.register('content')}
                            placeholder="What did you watch today?"
                            variant="social"
                        />

                        <ImagePreview image={image} onRemove={removeImage} />

                        {selectedMovie && <Controller
                            name='rating'
                            control={form.control}
                            disabled={form.getValues('movieTitle') == null}
                            render={({ field }) => (
                                <SelectedMovieCard
                                    movieTitle={selectedMovie}
                                    rating={field.value}
                                    setRating={(e) => {
                                        field.onChange(e);
                                    }}
                                    onClear={() => {
                                        form.setValue('movieTitle', "");
                                        form.setValue('rating', null);
                                    }}
                                />
                            )}
                        />}

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
                                    onClick={() => fileInputRef.current!.click()}
                                    data-active={!!image}
                                >
                                    <ImageIcon className='w-5 h-5' />
                                </Button>

                                {/* MOVIE SELECTOR */}
                                <Controller
                                    control={form.control}
                                    name='movieTitle'
                                    render={({ field }) => (
                                        <MovieSelectorDropdown
                                            onOpenChange={setShowMoviePicker}
                                            onSelect={field.onChange}
                                            value={field.value ?? undefined}
                                        />

                                    )}
                                />

                            </div>

                            <Button
                                type='submit'
                                variant='form'
                                size='pill'
                            >
                                Post <Send className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}