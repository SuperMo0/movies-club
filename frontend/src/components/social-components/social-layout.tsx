import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Button } from '../ui/button';
import { Wrench, WrenchIcon } from 'lucide-react'

export default function SocialLayout() {

    const location = useLocation();

    return (<QueryErrorResetBoundary>
        {({ reset }) => {
            return (
                <ErrorBoundary onReset={reset} resetKeys={[location.pathname]}
                    fallbackRender={({ error, resetErrorBoundary }) => {
                        return <div className='flex items-center justify-center mt-20'>
                            <div className='flex flex-col gap-2 items-center'>
                                <Wrench size={100} className='animate-pulse text-primary-foreground stroke-1'></Wrench>
                                <h1 className='text-2xl'> <span className='text-primary'>O</span>ops we ran into a problem please try refreshing!</h1>
                                <p>or you can contact me about the problem: moofk2002@gmail.com</p>
                                <Button variant='ghost' onClick={resetErrorBoundary}>Refresh</Button>
                            </div>
                        </div>

                    }}>
                    <Outlet />
                </ErrorBoundary>
            )
        }}

    </QueryErrorResetBoundary>)
}
