import React, { useRef, useEffect } from 'react';

export default function Footer() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameId = useRef(null);

    // --- Confetti Logic ---
    const config = {
        particleCount: 50,
        particleSize: 4,
        speedMultiplier: 1, // Increased slightly for better effect
        gravity: 0.15,
        colors: ['#ef4444', '#eab308', '#3b82f6', '#22c55e'] // Multi-colored confetti
    };

    // The Render Loop (Runs continuously if particles exist)
    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particlesRef.current.forEach((p, index) => {
            p.vy += config.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.rotation += p.vx * 2; // Add rotation for fun

            if (p.life > 0) {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);

                const opacity = Math.min(1, p.life / 30);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = opacity;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

                ctx.restore();
            } else {
                // Remove dead particles
                particlesRef.current.splice(index, 1);
            }
        });

        // Keep loop going if particles exist
        if (particlesRef.current.length > 0) {
            animationFrameId.current = requestAnimationFrame(render);
        } else {
            animationFrameId.current = null; // Stop loop to save resources
        }
    };

    const confettiBurst = (x, y) => {
        const newParticles = Array.from({ length: config.particleCount }, () => ({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8 * config.speedMultiplier,
            vy: (Math.random() - 1.5) * 8 * config.speedMultiplier, // More upward force
            size: config.particleSize + Math.random() * 4,
            life: 80 + Math.random() * 40,
            rotation: Math.random() * 360,
            color: config.colors[Math.floor(Math.random() * config.colors.length)]
        }));

        particlesRef.current.push(...newParticles);
        if (!animationFrameId.current) {
            render();
        }
    };

    const handlePopcornClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - canvasRef.current.getBoundingClientRect().left;
        const y = rect.top + rect.height / 2 - canvasRef.current.getBoundingClientRect().top;

        confettiBurst(x, y);
    };

    useEffect(() => {
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
    }, []);

    return (
        <footer className='relative w-full bg-slate-950 text-slate-300 border-t border-slate-900 overflow-hidden'>

            {/* The Invisible Canvas Layer */}
            <canvas
                ref={canvasRef}
                className='absolute inset-0 w-full h-full pointer-events-none z-50'
            />

            <div className='max-w-7xl mx-auto px-6 py-12 relative z-10'>
                <div className='flex flex-col md:flex-row justify-between items-center mb-10 gap-8'>

                    {/* Brand Section */}
                    <div className='flex flex-col items-center md:items-start'>
                        <h2 className='text-3xl font-extrabold tracking-tighter text-white'>
                            Movie<span className='text-red-600'>Club</span>
                        </h2>
                        <p className='text-sm text-slate-500 mt-2 max-w-xs text-center md:text-left'>
                            Your daily dose of cinema, delivered straight to your screen.
                        </p>
                    </div>

                    {/* Interactive Popcorn */}
                    <div className='relative group cursor-pointer' onClick={handlePopcornClick}>
                        <div className='absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse'>
                            Click for a treat! 🍿
                        </div>
                        {/* Custom SVG Popcorn */}
                        <svg
                            className='w-24 h-24 drop-shadow-2xl transition-transform duration-200 group-hover:scale-110 group-active:scale-95'
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Bucket */}
                            <path d="M50 80 L65 190 H135 L150 80 Z" fill="#DC2626" />
                            <path d="M60 80 L72 190 H82 L70 80 Z" fill="#FCA5A5" opacity="0.3" />
                            <path d="M90 80 L95 190 H105 L100 80 Z" fill="#FCA5A5" opacity="0.3" />
                            <path d="M120 80 L118 190 H128 L130 80 Z" fill="#FCA5A5" opacity="0.3" />
                            {/* Popcorn Kernels */}
                            <circle cx="70" cy="70" r="15" fill="#FEF08A" />
                            <circle cx="100" cy="60" r="18" fill="#FDE047" />
                            <circle cx="130" cy="70" r="15" fill="#FEF08A" />
                            <circle cx="85" cy="50" r="14" fill="#FEF08A" />
                            <circle cx="115" cy="50" r="14" fill="#FDE047" />
                        </svg>
                    </div>
                </div>

                <div className='w-full h-px bg-slate-800/50 mb-8' />

                <div className='flex flex-col-reverse md:flex-row justify-between items-center gap-8'>
                    <nav className='flex flex-wrap justify-center gap-6 text-sm font-medium'>
                        {['Movies', 'Community', 'Partners', 'Privacy', 'Contact'].map((item) => (
                            <a key={item} href="#" className='hover:text-red-500 transition-colors'>
                                {item}
                            </a>
                        ))}
                    </nav>

                    <div className='flex gap-5'>
                        <SocialIcon path="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        <SocialIcon path="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                        <SocialIcon path="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M16 2H8C4.7 2 2 4.7 2 8v8c0 3.3 2.7 6 6 6h8c3.3 0 6-2.7 6-6V8c0-3.3-2.7-6-6-6z" />
                    </div>
                </div>

                <div className='mt-8 text-center text-xs text-slate-600'>
                    © {new Date().getFullYear()} MovieClub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ path }) {
    return (
        <a href="#" className='group relative flex items-center justify-center p-2 rounded-full transition-all hover:bg-slate-800'>
            <div className='absolute inset-0 bg-red-600/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity' />
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 relative z-10 text-slate-400 group-hover:text-white transition-colors"
            >
                <path d={path} />
            </svg>
        </a>
    );
}