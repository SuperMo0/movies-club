import React, { useState, type ComponentProps } from 'react'


type PostImageProps = {
} & ComponentProps<'img'>

export default function PostImage(props: PostImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative mb-4 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 min-h-75">
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-slate-800" />
            )}
            <img
                src={props.src}
                alt={props.alt}
                onLoad={() => setIsLoaded(true)}
                className={`w-full object-cover max-h-100 transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
            />
        </div>
    );
}
