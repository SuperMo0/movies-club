import { useEffect, useState } from 'react';

// Viewport height that ignores the on-screen keyboard. On phones the keyboard shrinks the viewport,
// which would collapse anything sized in vh/dvh, so we keep the tallest height seen at the current
// width: shrinking (keyboard opening) is ignored, growing (keyboard closing, page loaded while the
// keyboard was still up) is picked up, and a width change (rotation, desktop resize) starts over.
export function useStableViewportHeight() {
    const [height, setHeight] = useState(() => window.innerHeight);

    useEffect(() => {
        let width = window.innerWidth;
        function handleResize() {
            if (window.innerWidth !== width) {
                width = window.innerWidth;
                setHeight(window.innerHeight);
            } else {
                setHeight(current => Math.max(current, window.innerHeight));
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return height;
}
