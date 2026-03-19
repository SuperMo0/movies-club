import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useLoginModal } from '@/App'
import { zodResolver } from '@hookform/resolvers/zod'

import { SignupSchema } from 'moviesclub-shared/auth'
import type { SignupType } from 'moviesclub-shared/auth'
import { useForm } from 'react-hook-form'

type SignupProps = { open: boolean, onOpenChange: (x: boolean) => void }

export default function Signup({ open, onOpenChange }: SignupProps) {
    const signup = useAuthStore(s => s.signup);
    const isSigningUp = useAuthStore(s => s.isSigningUp);
    const guestLogin = useAuthStore(s => s.guestLogin);
    const isLogginIn = useAuthStore(s => s.isLogginIn);

    const { openLogin } = useLoginModal();

    const form = useForm<SignupType>(
        {
            resolver: zodResolver(SignupSchema),
            defaultValues: {
                name: "",
                password: "",
                username: "",
            }
        }
    )

    async function handleGuestLogin() {
        let { success, message } = await guestLogin();
        if (!success) form.setError("root", { message });
        else onOpenChange(false);
    }

    async function handleSignupButtonClick(signupData: SignupType) {
        const { success, message } = await signup(signupData);
        if (!success) {
            form.setError("root", { message });
        } else {
            onOpenChange(false);
            form.reset();
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-0 gap-0"
            >
                <div className="relative p-8 pt-10">
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

                        {form.formState.errors.root && (
                            <p className='text-red-500 text-sm mt-3 font-medium bg-red-500/10 py-1 px-3 rounded-md animate-in fade-in slide-in-from-top-1'>
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
                                disabled={isSigningUp}
                                type="submit"
                            >
                                {isSigningUp ? "Creating Account..." : "Sign Up"}
                            </Button>

                            <Button
                                className="w-full h-11"
                                variant='form'
                                onClick={handleGuestLogin}
                                disabled={isSigningUp}
                                type="button"
                            >
                                {isLogginIn ? "Loggin In..." : "Login as Guest"}
                            </Button>

                        </FieldSet>
                    </form>

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
            </DialogContent>
        </Dialog>
    )
}