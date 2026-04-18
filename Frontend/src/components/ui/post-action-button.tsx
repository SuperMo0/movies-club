import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type ElementType } from 'react';

type PostActionPropsType = {
    onClick?: () => void,
    Icon: ElementType,
    count?: null | number,
    active?: boolean,
    tone?: "pink" | "blue" | "green" | "slate",
    className?: string
}
export function PostActionButton({ onClick = () => { }, Icon, count = null, active = false, tone = 'slate', className = "" }: PostActionPropsType) {
    const toneClasses = {
        pink: active ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500',
        blue: 'text-slate-500 hover:text-blue-400',
        green: 'text-slate-500 hover:text-green-400',
        slate: 'text-slate-500 hover:text-slate-300'
    };

    const bubbleClasses = {
        pink: 'group-hover:bg-pink-500/10',
        blue: 'group-hover:bg-blue-400/10',
        green: 'group-hover:bg-green-400/10',
        slate: 'group-hover:bg-slate-700/40'
    };

    return (
        <Button
            type='button'
            variant='social-action'
            onClick={onClick}
            className={cn(toneClasses[tone] || toneClasses.slate, className)}
        >
            <span className={cn('rounded-full p-2 transition-colors', bubbleClasses[tone] || bubbleClasses.slate)}>
                <Icon className={cn('h-5 w-5', active ? 'fill-current' : '')} />
            </span>
            {typeof count === 'number' && <span>{count}</span>}
        </Button>
    );
}
