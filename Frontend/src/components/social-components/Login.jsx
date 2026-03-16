import React, { useState } from 'react'
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Clapperboard, X } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useLoginModal } from '@/App'

export default function Login({ isOpen, onClose }) {

    const { login, isLogginIn, guestLogin } = useAuthStore()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);

    const { openSignup } = useLoginModal();


    if (!isOpen) return null;

    async function handleLoginButtonClick() {
        if (username.trim() == '' || password.trim() == '') {
            return setMessage('All Fields are required');
        }
        const { success, message } = await login({
            username,
            password
        })

        if (!success) setMessage(message);
    }

    async function handleGuestLogin() {

        let { success, message } = await guestLogin();

        if (!success) setMessage(message);
        else onClose();
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200'>

            <div className="relative w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">


                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 via-red-500 to-red-600"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className='p-8 pt-10'>
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/10 mb-4'>
                            <Clapperboard className='w-6 h-6 text-red-600' />
                        </div>
                        <h1 className='text-3xl font-bold text-white tracking-tight'>
                            Welcome Back
                        </h1>
                        <p className='text-slate-400 text-sm mt-2'>
                            Sign in to continue to <span className='text-red-500 font-semibold'>MovieClub</span>
                        </p>

                        <p className='text-slate-400 text-sm mt-2'>
                            <span className='text-red-500 font-semibold animate-in'>{message}</span>
                        </p>

                    </div>

                    {/* Form Section */}
                    <FieldSet className="space-y-6">
                        <FieldGroup className="space-y-4">
                            <Field className="space-y-1.5">
                                <FieldLabel htmlFor="username" className="text-xs font-medium uppercase text-slate-500 tracking-wider">
                                    Username
                                </FieldLabel>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-red-500/50 focus:ring-red-500/20 h-11"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                />
                            </Field>

                            <Field className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <FieldLabel htmlFor="password" className="text-xs font-medium uppercase text-slate-500 tracking-wider">
                                        Password
                                    </FieldLabel>
                                    <a href="#" className="text-xs text-red-500 hover:text-red-400 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-red-500/50 focus:ring-red-500/20 h-11"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                />
                            </Field>
                        </FieldGroup>

                        <Button className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-red-900/20"
                            onClick={handleLoginButtonClick}>
                            Sign In
                        </Button>

                        <Button
                            className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleGuestLogin}
                            disabled={isLogginIn}
                        >
                            {isLogginIn ? "Loggin In..." : "Login as Guest"}
                        </Button>
                    </FieldSet>

                    <div className='mt-6 text-center text-sm text-slate-500'>
                        Don't have an account?{' '}
                        <a type='button' onClick={openSignup} className='text-white hover:text-red-500 font-medium transition-colors cursor-pointer'>
                            Create one
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}