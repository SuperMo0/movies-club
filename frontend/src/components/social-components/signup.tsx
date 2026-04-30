import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { useLoginModal } from '@/App'
import { zodResolver } from '@hookform/resolvers/zod'

import { signupBodySchema } from 'moviesclub-shared/auth'
import type { SignupBody } from 'moviesclub-shared/auth'
import { useForm } from 'react-hook-form'
import { useState } from "react"
import { onMutationError, useLoginMutation, useSignupMutation } from "@/hooks/use-auth-mutations"
import { useLocation, useNavigate } from "react-router"


type SignupProps = { open: boolean, onOpenChange: (x: boolean) => void }

export default function Signup({ open, onOpenChange }: SignupProps) {

    const [message, setMessage] = useState<string | null>(null)
    const [errorKey, setErrorKey] = useState(0)

    const { openLogin } = useLoginModal();

    const navigate = useNavigate()
    const location = useLocation().pathname;

    const { mutate: mutateSignup, isPending: isPendingSignup } = useSignupMutation()
    const { mutate: mutateLogin, isPending: isPendingLogin } = useLoginMutation()

    const form = useForm<SignupBody>({ resolver: zodResolver(signupBodySchema) })

    async function handleGuestLogin() {
        mutateLogin({
            username: 'guest11',
            password: '123456'
        }, {
            onError: (error) => {
                onMutationError(error, setMessage);
                setErrorKey(prev => prev + 1);
            }
        })
    }

    async function handleSignupButtonClick(formData: SignupBody) {
        mutateSignup(formData, {
            onSuccess: () => { form.reset(); onOpenChange(false); navigate(location); },
            onError: (error) => {
                onMutationError(error, setMessage);
                setErrorKey(prev => prev + 1);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-[calc(100vw-2rem)] max-w-sm max-h-[80dvh] overflow-y-scroll md:overflow-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-0 gap-0"
            >

                <div className="relative p-6 sm:p-8 pt-10 overflow-y-auto max-h-[85dvh] custom-scrollbar">

                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 via-red-500 to-red-600"></div>
                    <div className='text-center mb-6'>
                        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/10 mb-4'>
                            <User className='w-6 h-6 text-red-600' />
                        </div>
                        <DialogTitle className='text-3xl font-bold text-white tracking-tight text-center'>
                            Create Account
                        </DialogTitle>
                        <DialogDescription className='text-slate-400 text-sm mt-2'>
                            Join the community at <span className='text-red-500 font-semibold'>MovieClub</span>
                        </DialogDescription>
                        {message && (
                            <p key={`${message}-${errorKey}`} className='text-slate-400 text-sm mt-2 animate-shake'>
                                <span className='text-red-500 font-semibold'>{message}</span>
                            </p>
                        )}

                        {form.formState.errors.root && (
                            <p key={`${form.formState.errors.root.message}-${form.formState.submitCount}`} className='text-red-500 text-sm mt-3 font-medium bg-red-500/10 py-1 px-3 rounded-md fade-in slide-in-from-top-1 animate-shake'>
                                {form.formState.errors.root.message}
                            </p>
                        )}
                    </div>
                    <form onSubmit={form.handleSubmit(handleSignupButtonClick)}>
                        <FieldSet className="space-y-5">
                            <FieldGroup className="space-y-4">
                                <Field className="space-y-1.5">
                                    <FieldLabel htmlFor="name" variant="form">
                                        Full Name
                                    </FieldLabel>
                                    <Input
                                        {...form.register("name")}
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        variant={"form"}
                                        autoComplete="name"
                                    />
                                    <FieldError>{form.formState.errors.name?.message}</FieldError>
                                </Field>

                                <Field className="space-y-1.5">
                                    <FieldLabel htmlFor="username" variant="form">
                                        Username
                                    </FieldLabel>
                                    <Input
                                        {...form.register("username")}
                                        id="username"
                                        type="text"
                                        placeholder="johndoe123"
                                        variant={"form"}
                                        autoComplete="username"
                                    />
                                    <FieldError>{form.formState.errors.username?.message}</FieldError>
                                </Field>

                                <Field className="space-y-1.5">
                                    <FieldLabel htmlFor="password" variant="form">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...form.register("password")}
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        variant={"form"}
                                    />
                                    <FieldError>{form.formState.errors.password?.message}</FieldError>
                                </Field>
                            </FieldGroup>

                            <Button
                                className="w-full h-11"
                                variant="form"
                                disabled={isPendingSignup}
                                type="submit"
                            >
                                {isPendingSignup ? "Creating Account..." : "Sign Up"}
                            </Button>

                            <Button
                                className="w-full h-11"
                                variant='form'
                                onClick={handleGuestLogin}
                                disabled={isPendingLogin}
                                type="button"
                            >
                                {isPendingLogin ? "Logging In..." : "Login as Guest"}
                            </Button>

                        </FieldSet>
                    </form>

                    <div className='mt-6 text-center text-sm text-slate-500'>
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={openLogin}
                            className='text-white hover:text-red-500 font-medium transition-colors cursor-pointer outline-none'
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}