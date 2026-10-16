import { useState, type ComponentProps, type SyntheticEvent } from 'react'

type PostImageProps = {
    aspectRatio?: string
} & ComponentProps<'img'>

// Images keep their own shape, clamped between portrait 4:5 and wide 16:9, so posters aren't cut down to a strip.
// Tall images are capped at MAX_HEIGHT on wide screens by narrowing them instead of cropping.
const MIN_RATIO = 4 / 5;
const MAX_RATIO = 16 / 9;
const MAX_HEIGHT = '30rem';

export default function PostImage({ aspectRatio = "16/9", src, className }: PostImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [naturalRatio, setNaturalRatio] = useState<number | null>(null);

    function handleLoad(e: SyntheticEvent<HTMLImageElement>) {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth && naturalHeight) {
            setNaturalRatio(Math.min(MAX_RATIO, Math.max(MIN_RATIO, naturalWidth / naturalHeight)));
        }
        setIsLoaded(true);
    }

    const ratio = naturalRatio ?? aspectRatio;
    return (
        <div
            className="relative mx-auto w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
            style={{ aspectRatio: ratio, maxWidth: `calc(${MAX_HEIGHT} * (${ratio}))` }}
        >
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-slate-800" />
            )}
            <img
                src={src}
                alt=""
                loading="lazy"
                onLoad={handleLoad}
                className={`h-full w-full object-cover transition-opacity duration-300 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
            />
        </div>
    );
}
