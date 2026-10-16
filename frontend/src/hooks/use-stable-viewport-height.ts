import { useEffect, useState } from 'react';

// Viewport height that ignores height-only changes. On phones the on-screen keyboard shrinks the
// viewport, which would collapse anything sized in vh/dvh; we only re-measure when the width
// changes (rotation, window resize on desktop).
export function useStableViewportHeight() {
    const [height, setHeight] = useState(() => window.innerHeight);

    useEffect(() => {
        let width = window.innerWidth;
        function handleResize() {
            if (window.innerWidth === width) return;
            width = window.innerWidth;
            setHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return height;
}
