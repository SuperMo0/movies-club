import React, { useState, type ComponentProps } from 'react'

type PostImageProps = {
    aspectRatio?: string
} & ComponentProps<'img'>

export default function PostImage({ aspectRatio = "16/9", src, className }: PostImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
            style={{ aspectRatio }}
        >
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-slate-800" />
            )}
            <img
                src={src}
                onLoad={() => setIsLoaded(true)}
                className={`h-full w-full object-cover transition-opacity duration-300 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
            />
        </div>
    );
}