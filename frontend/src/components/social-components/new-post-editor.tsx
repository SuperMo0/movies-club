import { Image as ImageIcon, Send } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SelectedMovieCard, MovieSelectorDropdown } from '@/components/social-components/movie-selectors';
import { ImagePreview } from '@/components/social-components/image-preview';
import { useImagePreview } from '@/hooks/use-image-preview';
import defaultAvatar from '/default-avatar.jpg';
import { usePOSTPost } from '@/hooks/use-social-mutations';
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostBodyClientSchema, type CreatePostBodyClient } from 'moviesclub-shared/social';
import { useSession } from '@/hooks/use-auth-queries';


export default function NewPostEditor() {

    const { fileInputRef, handleImageUpload, image, removeImage } = useImagePreview();

    const authUser = useSession().data?.user;

    const form = useForm<CreatePostBodyClient>({
        resolver: zodResolver(createPostBodyClientSchema),
    })

    const selectedMovie = form.watch('movieTitle');

    const { mutate: mutatePosts, isPending } = usePOSTPost();

    async function handlePostSubmit(data: CreatePostBodyClient) {
        mutatePosts(data, {
            onSuccess: () => { form.reset(), removeImage() },
            onError: () => {
                form.setError('root', { message: 'Unexpected error, please try again later.' })
            }
        });
    }

    return (
        <form onSubmit={form.handleSubmit(handlePostSubmit)}>
            {Object.values(form.formState.errors).map((x, ix) => <p key={ix} className='text-red-600'>* {x.message}</p>)}
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
                                    rating={field.value ?? null}
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
                                <Controller
                                    control={form.control}
                                    name='image'
                                    render={({ field }) => {
                                        return <input
                                            type="file"
                                            accept="image/*"
                                            id='image'
                                            hidden
                                            ref={(node) => { field.ref(node); fileInputRef.current = node }}
                                            onChange={(e) => { handleImageUpload(e); field.onChange(e.target.files?.[0]) }}
                                        />

                                    }}
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
                                            onChange={field.onChange}
                                            value={field.value ?? undefined}
                                        />

                                    )}
                                />
                            </div>
                            <Button
                                type='submit'
                                variant='form'
                                size='pill'
                                disabled={isPending}
                            >
                                Post <Send className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form >
    )
}