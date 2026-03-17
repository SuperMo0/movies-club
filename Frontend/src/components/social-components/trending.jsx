import React from 'react'
import { TrendingUp, Flame, Hash } from 'lucide-react'

export default function Trending() {
    const trends = [
        { title: "Dune: Part Two", posts: "125K" },
        { title: "Oppenheimer", posts: "89K" },
        { title: "Deadpool 3", posts: "45K" },
        { title: "#Oscars2026", posts: "22K" },
        { title: "Scorsese", posts: "12K" },
    ];

    return (
        <div className='flex flex-col gap-6'>
            {/* Trending Card */}
            <div className='bg-slate-900 border border-slate-800 rounded-xl p-5'>
                <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                    <TrendingUp className='w-5 h-5 text-red-500' /> Trending Now
                </h3>

                <div className='flex flex-col gap-5'>
                    {trends.map((trend, i) => (
                        <div key={i} className='flex justify-between items-center cursor-pointer group'>
                            <div>
                                <p className='text-slate-200 font-medium group-hover:text-red-400 transition-colors text-sm'>
                                    {trend.title}
                                </p>
                                <p className='text-xs text-slate-500'>{trend.posts} Posts</p>
                            </div>
                            <MoreHorizontal className='w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100' />
                        </div>
                    ))}
                </div>

                <button className='w-full mt-6 text-sm text-red-500 hover:text-red-400 text-left'>
                    Show more
                </button>
            </div>

            {/* Suggestion Card */}
            <div className='bg-slate-900 border border-slate-800 rounded-xl p-5'>
                <h3 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                    <Flame className='w-5 h-5 text-orange-500' /> Hot Discussions
                </h3>
                <div className='space-y-4'>
                    <div className='text-sm text-slate-400'>
                        <span className='block text-slate-200 font-medium mb-1'>Best Sci-Fi of the decade?</span>
                        <p className='text-xs'>2.4k people talking about this</p>
                    </div>
                    <div className='text-sm text-slate-400'>
                        <span className='block text-slate-200 font-medium mb-1'>Marvel Phase 6 leaks</span>
                        <p className='text-xs'>12k people talking about this</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
// Helper component for the Trending logic if needed
function MoreHorizontal({ className }) {
    return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
}