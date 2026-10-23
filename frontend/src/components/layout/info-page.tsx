import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type InfoPageProps = {
    eyebrow: string,
    title: ReactNode,
    intro?: ReactNode,
    children: ReactNode,
}

// Shared layout for the footer pages (partners, privacy, contact, join us).
export default function InfoPage({ eyebrow, title, intro, children }: InfoPageProps) {
    return (
        <main className="px-4 py-12 md:py-16">
            <div className="mx-auto max-w-3xl">
                <p className="mb-3 text-xs font-bold tracking-[0.2em] text-red-500 uppercase">{eyebrow}</p>
                <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">{title}</h1>
                {intro && <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">{intro}</p>}
                <div className="mt-10 md:mt-12">{children}</div>
            </div>
        </main>
    );
}

export function InfoCard({ children, className = '' }: { children: ReactNode, className?: string }) {
    return <div className={cn('rounded-2xl border border-slate-800 bg-slate-900/50 p-5 md:p-6', className)}>{children}</div>;
}
