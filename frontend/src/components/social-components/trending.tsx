import { useMemo } from 'react'
import { NavLink } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Flame, Film, Star, MessageCircle, Heart } from 'lucide-react'
import { useTrending } from '@/hooks/use-social-queries'
import { GETTodayMovies } from '@/api/movies.api'

function SkeletonRows({ count }: { count: number }) {
    return Array.from({ length: count }, (_, i) => (
        <div key={i} className='flex animate-pulse items-center gap-3'>
            <div className='h-12 w-9 shrink-0 rounded-md bg-slate-800' />
            <div className='flex grow flex-col gap-2'>
                <div className='h-3 w-3/4 rounded bg-slate-800' />
                <div className='h-2.5 w-1/3 rounded bg-slate-800' />
            </div>
        </div>
    ));
}

export default function Trending() {
    const { data, isPending, isError } = useTrending();

    // Posters for movies that are showing now, so trending titles get a thumbnail.
    const { data: movies } = useQuery({ queryKey: ['movies'], queryFn: GETTodayMovies, staleTime: Infinity });
    const posters = useMemo(() => new Map(movies?.movies.map(m => [m.title, m.image])), [movies]);

    const trendingMovies = data?.trendingMovies ?? [];
    const hotDiscussions = data?.hotDiscussions ?? [];

    return (
        <div className='flex flex-col gap-6'>
            <div className='bg-slate-900 border border-slate-800 rounded-xl p-5'>
                <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                    <TrendingUp className='w-5 h-5 text-red-500' /> Trending Now
                </h3>
                <p className='mb-4 text-xs text-slate-500'>Most rated movies this month</p>

                <div className='flex flex-col gap-4'>
                    {isPending ? <SkeletonRows count={4} />
                        : isError ? <p className='text-sm text-slate-500'>Couldn't load trending movies.</p>
                            : trendingMovies.length === 0 ? (
                                <p className='text-sm text-slate-500'>No ratings yet this month. Rate a movie to start the list.</p>
                            ) : trendingMovies.map((movie, i) => {
                                const poster = posters.get(movie.title);
                                return (
                                    <div key={movie.title} className='flex items-center gap-3'>
                                        <span className='w-4 shrink-0 text-center text-sm font-bold text-slate-600 tabular-nums'>{i + 1}</span>
                                        {poster
                                            ? <img src={poster} alt='' loading='lazy' className='h-12 w-9 shrink-0 rounded-md object-cover ring-1 ring-white/10' />
                                            : <div className='flex h-12 w-9 shrink-0 items-center justify-center rounded-md bg-slate-800 text-slate-500'><Film className='size-4' /></div>}
                                        <div className='min-w-0'>
                                            <p className='truncate text-sm font-medium text-slate-200'>{movie.title}</p>
                                            <p className='flex items-center gap-1.5 text-xs text-slate-500'>
                                                {movie.averageRating !== null && (
                                                    <>
                                                        <Star className='size-3 fill-yellow-500 text-yellow-500' />
                                                        <span className='text-slate-300 tabular-nums'>{movie.averageRating}</span>
                                                        <span>·</span>
                                                    </>
                                                )}
                                                {movie.posts} {movie.posts === 1 ? 'post' : 'posts'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                </div>
            </div>

            <div className='bg-slate-900 border border-slate-800 rounded-xl p-5'>
                <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                    <Flame className='w-5 h-5 text-orange-500' /> Hot Discussions
                </h3>
                <p className='mb-4 text-xs text-slate-500'>Posts people are talking about</p>

                <div className='flex flex-col gap-4'>
                    {isPending ? <SkeletonRows count={2} />
                        : isError ? <p className='text-sm text-slate-500'>Couldn't load discussions.</p>
                            : hotDiscussions.length === 0 ? (
                                <p className='text-sm text-slate-500'>No discussions yet. Comment on a post to get one going.</p>
                            ) : hotDiscussions.map(post => (
                                <NavLink
                                    key={post.id}
                                    to={`/social/users/${post.author.username}`}
                                    className='group block rounded-lg -mx-2 px-2 py-1.5 transition-colors hover:bg-white/5'
                                >
                                    {post.movieTitle && (
                                        <span className='mb-0.5 flex items-center gap-1 text-xs font-medium text-red-400'>
                                            <Film className='size-3' /> {post.movieTitle}
                                        </span>
                                    )}
                                    <p className='line-clamp-2 text-sm text-slate-200 group-hover:text-white'>{post.content}</p>
                                    <p className='mt-1 flex items-center gap-3 text-xs text-slate-500'>
                                        <span className='truncate'>{post.author.name}</span>
                                        <span className='flex shrink-0 items-center gap-1'><MessageCircle className='size-3' />{post.comments}</span>
                                        <span className='flex shrink-0 items-center gap-1'><Heart className='size-3' />{post.likes}</span>
                                    </p>
                                </NavLink>
                            ))}
                </div>
            </div>
        </div>
    )
}
