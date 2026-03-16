import React from 'react'
import SocialFeed from '@/components/social-components/SocialFeed'
import Trending from '@/components/social-components/Trending'

export default function SocialMainPage() {
    return (
        <div className='min-h-screen bg-slate-950 text-slate-200 py-8'>
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