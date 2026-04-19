import React from 'react'

export default function LoadingScreen({ message = "Loading..." }) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
            <div className="animate-pulse text-lg font-medium">{message}</div>
        </div>
    )
}
