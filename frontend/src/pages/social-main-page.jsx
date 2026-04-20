import SocialFeed from '@/components/social-components/social-feed'
import Trending from '@/components/social-components/trending'

export default function SocialMainPage() {
    return (
        <div className='min-h-screen bg-slate-950 text-slate-200 py-8'>
            <p className='text-red-500'>some functionalities are not working currently as I'm migrating everything to react-router, typescript and react-hook-form</p>
            <p className='text-red-600'>{"4/20/2026"}</p>
            <div className='max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start'>

                <main>
                    <SocialFeed />
                </main>

                <aside className='hidden lg:block sticky top-24'>
                    <Trending />
                </aside>
            </div>
        </div>
    )
}