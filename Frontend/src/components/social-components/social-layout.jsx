import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useSocialStore } from '@/stores/social.store';
import { useAuthStore } from '@/stores/auth.store';
import { useMoviesStore } from '@/stores/movies.store';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function SocialLayout() {
    const getPosts = useSocialStore(state => state.getPosts);
    const getUsers = useSocialStore(state => state.getUsers);
    const users = useSocialStore(state => state.users);
    const allPosts = useSocialStore(state => state.allPosts);
    const likedPosts = useSocialStore(state => state.likedPosts);
    const getLikedPosts = useSocialStore(state => state.getLikedPosts);

    const authUser = useAuthStore(state => state.authUser);

    const allMovies = useMoviesStore(state => state.allMovies);
    const getAllMovies = useMoviesStore(state => state.getAllMovies);
    const todayMovies = useMoviesStore(state => state.todayMovies);
    const getTodayMovie = useMoviesStore(state => state.getTodayMovie);

    useEffect(() => {
        if (!users) getUsers();
        if (!allPosts) getPosts();
        if (!allMovies) getAllMovies();
        if (!todayMovies) getTodayMovie();
        if (authUser && !likedPosts) getLikedPosts();
    }, [authUser]);

    const isLoading = !users || !allPosts || !allMovies || !todayMovies || (authUser && !likedPosts);

    if (isLoading) {
        return <LoadingScreen message="Loading Social Area..." />;
    }


    return <Outlet />;
}
