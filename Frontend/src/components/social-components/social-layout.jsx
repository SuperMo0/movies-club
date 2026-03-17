import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useSocialStore } from '@/stores/social.store';
import { useAuthStore } from '@/stores/auth.store';
import { useMoviesStore } from '@/stores/movies.store';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function SocialLayout() {
    const { getPosts, getUsers, users, allPosts, likedPosts, getLikedPosts } = useSocialStore();
    const { authUser } = useAuthStore();
    const { allMovies, getAllMovies } = useMoviesStore();

    useEffect(() => {
        if (!users) getUsers();
        if (!allPosts) getPosts();
        if (!allMovies) getAllMovies();
        if (authUser && !likedPosts) getLikedPosts();
    }, [authUser, users, allPosts, allMovies, likedPosts]);

    const isLoading = !users || !allPosts || !allMovies || (authUser && !likedPosts);

    if (isLoading) {
        return <LoadingScreen message="Loading Social Area..." />;
    }

    return <Outlet />;
}
