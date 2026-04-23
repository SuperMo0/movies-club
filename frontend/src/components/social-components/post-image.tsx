import React, { useState, type ComponentProps } from 'react'


type PostImageProps = {
} & ComponentProps<'img'>

export default function PostImage(props: PostImageProps) {
    const [isLoaded, setIsLoaded] = useState(true);

    return (
        <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 min-h-75">
            {!isLoaded ?
                <div className="absolute inset-0 animate-pulse bg-slate-800" />
                : <img
                    src={props.src}
                    alt={props.alt}
                    onLoad={() => setIsLoaded(true)}
                    className={"h-full"}
                />

            }
        </div>

    );
}
