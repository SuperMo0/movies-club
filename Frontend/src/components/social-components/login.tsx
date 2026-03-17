import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Clapperboard } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useLoginModal } from '@/App'
import { LoginSchema, type LoginType } from 'moviesclub-shared/auth'

type LoginProps = {
    open: boolean
    onOpenChange: (v: boolean) => void
}

export default function Login({ open, onOpenChange }: LoginProps) {
    const { login, isLogginIn, guestLogin } = useAuthStore()
    const [message, setMessage] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const { openSignup } = useLoginModal();


    async function handleLoginButtonClick(data: LoginType) {
        setMessage(null)
        const { success, message } = await login(data)

        if (!success) setMessage(message)
        else onOpenChange(false);
    }

    async function handleGuestLogin() {

        let { success, message } = await guestLogin();

        if (!success) setMessage(message);
        else onOpenChange(false);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-0 gap-0"
            >
                <div className="relative p-8 pt-10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 via-red-500 to-red-600"></div>
                    <div className='text-center mb-8'>
                        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/10 mb-4'>
                            <Clapperboard className='w-6 h-6 text-red-600' />
                        </div>
                        <DialogTitle className='text-3xl font-bold text-white tracking-tight text-center'>
                            Welcome Back
                        </DialogTitle>
                        <DialogDescription className='text-slate-400 text-sm mt-2'>
                            Sign in to continue to <span className='text-red-500 font-semibold'>MovieClub</span>
                        </DialogDescription>

                        {message && (
                            <p className='text-slate-400 text-sm mt-2'>
                                <span className='text-red-500 font-semibold animate-in'>{message}</span>
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(handleLoginButtonClick)}>
                        <FieldSet className="space-y-6">
                            <FieldGroup className="space-y-4">
                                <Field className="space-y-1.5">
                                    <FieldLabel htmlFor="username" variant="form">
                                        Username
                                    </FieldLabel>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        variant="form"
                                        {...register('username')}
                                    />
                                    <FieldError>{errors.username?.message}</FieldError>
                                </Field>

                                <Field className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <FieldLabel htmlFor="password" variant="form">
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
                                        variant="form"
                                        {...register('password')}
                                    />
                                    <FieldError>{errors.password?.message}</FieldError>
                                </Field>
                            </FieldGroup>

                            <Button type="submit" variant="form" className="w-full h-11">
                                Sign In
                            </Button>

                            <Button
                                type="button"
                                variant="form"
                                className="w-full h-11"
                                onClick={handleGuestLogin}
                                disabled={isLogginIn}
                            >
                                {isLogginIn ? "Loggin In..." : "Login as Guest"}
                            </Button>
                        </FieldSet>
                    </form>

                    <div className='mt-6 text-center text-sm text-slate-500'>
                        Don't have an account?{' '}
                        <button type='button' onClick={openSignup} className='text-white hover:text-red-500 font-medium transition-colors cursor-pointer'>
                            Create one
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}