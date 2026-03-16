import React, { useState } from 'react'
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Clapperboard, X, User } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useLoginModal } from '@/App'

export default function Signup({ isOpen, onClose }) {

    const { signup, isSigningUp, guestLogin, isLogginIn } = useAuthStore()


    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);

    const { openLogin, openSignup } = useLoginModal();

    if (!isOpen) return null;


    async function handleGuestLogin() {

        let { success, message } = await guestLogin();

        if (!success) setMessage(message);
        else onClose();
    }

    async function handleSignupButtonClick() {
        if (username.trim() == '' || password.trim() == '' || name.trim == '') {
            return setMessage('All Fields are required');
        }
        setMessage(null);
        const { success, message } = await signup({
            name,
            username,
            password
        })

        if (!success) {
            setMessage(message);
        } else {
            onClose();
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200'>

            <div className="relative w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 via-red-500 to-red-600"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className='p-8 pt-10'>
                    {/* Header Section */}
                    <div className='text-center mb-6'>
                        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/10 mb-4'>
                            <User className='w-6 h-6 text-red-600' />
                        </div>
                        <h1 className='text-3xl font-bold text-white tracking-tight'>
                            Create Account
                        </h1>
                        <p className='text-slate-400 text-sm mt-2'>
                            Join the community at <span className='text-red-500 font-semibold'>MovieClub</span>
                        </p>

                        {message && (
                            <p className='text-red-500 text-sm mt-3 font-medium bg-red-500/10 py-1 px-3 rounded-md animate-in fade-in slide-in-from-top-1'>
                                {message}
                            </p>
                        )}
                    </div>
                    <FieldSet className="space-y-5">
                        <FieldGroup className="space-y-4">
                            <Field className="space-y-1.5">
                                <FieldLabel htmlFor="name" className="text-xs font-medium uppercase text-slate-500 tracking-wider">
                                    Full Name
                                </FieldLabel>
                                <Input
                                    required
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-red-500/50 focus:ring-red-500/20 h-11"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Field>

                            {/* Username Field */}
                            <Field className="space-y-1.5">
                                <FieldLabel htmlFor="username" className="text-xs font-medium uppercase text-slate-500 tracking-wider">
                                    Username
                                </FieldLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe123"
                                    className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-red-500/50 focus:ring-red-500/20 h-11"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Field>

                            {/* Password Field */}
                            <Field className="space-y-1.5">
                                <FieldLabel htmlFor="password" className="text-xs font-medium uppercase text-slate-500 tracking-wider">
                                    Password
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-red-500/50 focus:ring-red-500/20 h-11"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Field>
                        </FieldGroup>

                        <Button
                            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSignupButtonClick}
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? "Creating Account..." : "Sign Up"}
                        </Button>

                        <Button
                            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleGuestLogin}
                            disabled={isSigningUp}
                        >
                            {isLogginIn ? "Loggin In..." : "Login as Guest"}
                        </Button>

                    </FieldSet>

                    <div className='mt-6 text-center text-sm text-slate-500'>
                        Already have an account?{' '}
                        <button
                            onClick={openLogin}
                            className='text-white hover:text-red-500 font-medium transition-colors cursor-pointer outline-none'
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}