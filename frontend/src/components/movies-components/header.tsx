import { useState } from 'react';
import { CircleUserRound, LogIn, LogOut, UserPlus, UserRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from 'react-router';
import { useQueryClient } from '@tanstack/react-query'
import { useLogoutMutation } from '@/hooks/use-auth-mutations.tsx';
import type { SessionResponse } from 'moviesclub-shared/auth';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import defaultAvatar from '/default-avatar.jpg';

const navLinks = [
    { name: "Movies", href: "/" },
    { name: "Social Area", href: "/social/main" },
];

const mobileTabStyles = "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors";

const accountItemStyles = "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

const navStyles = "text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:drop-shadow-glow-red";

type HeaderProps = {
    onLoginClick: () => void,
    onSignupClick: () => void
}

const Header = ({ onLoginClick, onSignupClick }: HeaderProps) => {

    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const isSocial = useLocation().pathname.startsWith('/social');

    const queryClient = useQueryClient();

    const logoutMutate = useLogoutMutation();

    const handleLogout = async () => {
        setIsAccountOpen(false);
        logoutMutate.mutate();
    };

    const authUser = queryClient.getQueryData<SessionResponse>(["session"])?.user;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

                <NavLink to={"/"}><h1 className="text-xl min-[400px]:text-2xl font-extrabold tracking-tight transition-all hover:opacity-90">
                    Movie
                    <span className="text-primary drop-shadow-glow-red">Club</span>
                </h1></NavLink>

                <nav className="hidden gap-8 md:flex">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className={({ isActive }) => (isActive ? cn(navStyles, "text-primary") : cn(navStyles))}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    {authUser && <NavLink className={({ isActive }) => (isActive ? cn(navStyles, "text-primary") : cn(navStyles))}
                        to={`/social/users/${authUser.username}`}>My Profile</NavLink>}
                </nav>

                <div className="hidden items-center gap-4 md:flex">
                    {authUser ? (
                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:text-white hover:bg-white/5"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={onLoginClick}>
                                Login
                            </Button>
                            <Button variant='default' onClick={onSignupClick}>
                                Signup
                            </Button>
                        </>
                    )}
                </div>

                <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:hidden">
                    <NavLink
                        to="/"
                        className={cn(mobileTabStyles, isSocial ? "text-muted-foreground hover:text-foreground" : "bg-primary text-primary-foreground")}
                    >
                        Movies
                    </NavLink>
                    <NavLink
                        to="/social/main"
                        className={cn(mobileTabStyles, isSocial ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                    >
                        Social
                    </NavLink>
                </nav>

                <Popover open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                    <PopoverTrigger asChild>
                        <button
                            aria-label="Account"
                            className={cn(
                                "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border transition-colors md:hidden",
                                authUser
                                    ? "border-primary/60 ring-2 ring-primary/20 hover:border-primary"
                                    : "border-white/10 bg-white/5 text-foreground hover:border-primary/60 hover:text-primary",
                            )}
                        >
                            {authUser
                                ? <img src={authUser.image || defaultAvatar} alt="" className="size-full object-cover" />
                                : <CircleUserRound className="size-5" strokeWidth={1.75} />}
                        </button>
                    </PopoverTrigger>

                    <PopoverContent align="end" sideOffset={10} className="w-64 rounded-xl border-white/10 bg-popover/95 p-2 shadow-2xl backdrop-blur-xl md:hidden">
                        {authUser ? (
                            <>
                                <div className="flex items-center gap-3 px-3 pt-2 pb-3">
                                    <img src={authUser.image || defaultAvatar} alt="" className="size-10 shrink-0 rounded-full object-cover ring-1 ring-white/10" />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-foreground">{authUser.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">@{authUser.username}</p>
                                    </div>
                                </div>
                                <div className="mb-1 h-px bg-white/10" />
                                <NavLink
                                    to={`/social/users/${authUser.username}`}
                                    onClick={() => setIsAccountOpen(false)}
                                    className={cn(accountItemStyles, "text-foreground/90 hover:bg-white/5")}
                                >
                                    <UserRound className="size-4 text-muted-foreground" />
                                    My profile
                                </NavLink>
                                <button onClick={handleLogout} className={cn(accountItemStyles, "text-red-400 hover:bg-red-500/10")}>
                                    <LogOut className="size-4" />
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="px-3 pt-2 pb-3">
                                    <p className="text-sm font-semibold text-foreground">Welcome to MovieClub</p>
                                    <p className="text-xs text-muted-foreground">Rate movies and join the discussion.</p>
                                </div>
                                <button
                                    onClick={() => { setIsAccountOpen(false); onLoginClick(); }}
                                    className={cn(accountItemStyles, "text-foreground/90 hover:bg-white/5")}
                                >
                                    <LogIn className="size-4 text-muted-foreground" />
                                    Log in
                                </button>
                                <button
                                    onClick={() => { setIsAccountOpen(false); onSignupClick(); }}
                                    className={cn(accountItemStyles, "mt-1 justify-center bg-primary text-primary-foreground hover:bg-primary/90")}
                                >
                                    <UserPlus className="size-4" />
                                    Sign up
                                </button>
                            </>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
};

export default Header;