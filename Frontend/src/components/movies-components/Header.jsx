import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NavLink } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';

const Header = ({ onLoginClick, onSignupClick }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { authUser, logout } = useAuthStore();

    const navLinks = [
        { name: "Movies", href: "/" },
        { name: "Community", href: "/social" },
    ];

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

                <h1 className="text-2xl font-extrabold tracking-tight transition-all hover:opacity-90">
                    Movie
                    <span className="text-primary drop-shadow-glow-red">Club</span>
                </h1>

                <nav className="hidden gap-8 md:flex">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:drop-shadow-glow-red"
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden items-center gap-4 md:flex">
                    {authUser ? (

                        <>
                            <Button
                                variant="ghost"
                                className="text-muted-foreground hover:text-white hover:bg-white/5"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>

                            <NavLink to={`/social/user/${authUser.id}`}>
                                <Button className="shadow-neon-red hover:shadow-neon-intense transition-all duration-300">
                                    My Profile
                                </Button>
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={onLoginClick}>
                                Login
                            </Button>
                            <Button
                                className="shadow-neon-red hover:shadow-neon-intense transition-all duration-300"
                                onClick={onSignupClick}
                            >
                                Signup
                            </Button>
                        </>
                    )}
                </div>

                <button
                    className="flex items-center p-2 md:hidden text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl p-4 md:hidden flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.href}
                                className="text-lg font-medium text-foreground/80 hover:text-primary hover:pl-2 transition-all duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border/40">
                        {authUser ? (
                            <>
                                <NavLink to={`/social/user/${authUser.id}`} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full shadow-neon-red">
                                        Profile
                                    </Button>
                                </NavLink>

                                <Button
                                    variant="ghost"
                                    className="justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="justify-start hover:text-primary hover:bg-primary/10"
                                    onClick={() => {
                                        onLoginClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    className="shadow-neon-red"
                                    onClick={() => {
                                        onSignupClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    Signup
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;