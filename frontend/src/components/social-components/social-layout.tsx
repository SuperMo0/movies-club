import { Outlet } from 'react-router';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { Suspense } from 'react';

export default function SocialLayout() {

    return <Suspense fallback={<LoadingScreen message="Loading Social Area..." />}>
        {<Outlet />}
    </Suspense>
}
