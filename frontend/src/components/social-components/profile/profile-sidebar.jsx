import React from 'react';
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function ProfileSidebar({ state, refs }) {
    const { user, posts, isEditing } = state;
    const { bioRef } = refs;

    const stats = [
        { label: 'Reviews', value: posts.length },
        { label: 'Followers', value: user._count?.followedBy || 0 },
        { label: 'Following', value: user._count?.following || 0 },
    ];

    return (
        <div className='w-full md:w-1/3 flex flex-col gap-6'>
            {/* Bio and Info */}
            <div>
                {isEditing ? (
                    <Textarea
                        ref={bioRef}
                        defaultValue={user.bio || ""}
                        variant="profile-bio"
                        placeholder="Tell us about yourself..."
                    />
                ) : (
                    <p className='text-slate-300 leading-relaxed text-sm md:text-base'>
                        {user.bio || "No bio yet."}
                    </p>
                )}

                <div className='mt-4 flex flex-col gap-2 text-sm text-slate-500'>
                    <div className='flex items-center gap-2'>
                        <MapPin className='w-4 h-4' /> Egypt
                    </div>
                    <div className='flex items-center gap-2'>
                        <LinkIcon className='w-4 h-4' /> <a href="#" className='text-red-400 hover:underline'>letterboxd.com/{user.username}</a>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4' /> {`Joined ${user.joinedAt?.slice(0, 10)}`}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className='flex justify-between md:justify-start md:gap-8 border-y border-slate-800 py-4'>
                {stats.map((stat) => (
                    <div key={stat.label} className='text-center md:text-left'>
                        <span className='block text-xl font-bold text-white'>{stat.value}</span>
                        <span className='text-xs text-slate-500 uppercase tracking-wide'>{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}