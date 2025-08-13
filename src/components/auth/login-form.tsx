
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const resetFormSchema = z.object({
    resetEmail: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ResetFormValues = z.infer<typeof resetFormSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
        resetEmail: ''
    }
  })

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      if (!auth) {
        throw new Error('Authentication service is not available. Please refresh the page.');
      }
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Redirect handled by auth context
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.code === 'auth/invalid-credential' 
            ? 'Invalid email or password. Please try again.'
            : error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onResetSubmit = async (data: ResetFormValues) => {
    setIsResetLoading(true);
    try {
        if (!auth) {
          throw new Error('Authentication service is not available. Please refresh the page.');
        }
        await sendPasswordResetEmail(auth, data.resetEmail);
        toast({
            title: "Password Reset Email Sent",
            description: `If an account exists for ${data.resetEmail}, you will receive an email with instructions to reset your password.`,
        });
        setDialogOpen(false);
    } catch (error: any) {
        console.error("Password Reset Error:", error);
        toast({
            variant: "destructive",
            title: "Error Sending Reset Email",
            description: "An unexpected error occurred. Please try again."
        });
    } finally {
        setIsResetLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Card className="w-full max-w-md shadow-2xl shadow-primary/10 transition-shadow duration-300 hover:shadow-primary/20">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <DialogTrigger asChild>
                         <Button variant="link" className="p-0 h-auto text-xs text-primary">
                            Forgot password?
                        </Button>
                    </DialogTrigger>
                </div>
                <div className="relative">
                <Input
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...loginForm.register('password')}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                </div>
                {loginForm.formState.errors.password && <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>}
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                {isLoading && <LoadingSpinner size={20} className="mr-2"/>}
                Sign In
            </Button>
            
            <p className="text-sm text-muted-foreground pt-4">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign Up
                </Link>
            </p>
            </CardFooter>
        </form>
        </Card>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogDescription>
                    Enter your email address below and we'll send you a link to reset your password.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)}>
                 <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                        id="reset-email"
                        placeholder="name@example.com"
                        type="email"
                        disabled={isResetLoading}
                        {...resetForm.register('resetEmail')}
                    />
                    {resetForm.formState.errors.resetEmail && <p className="text-sm text-destructive">{resetForm.formState.errors.resetEmail.message}</p>}
                </div>
                <DialogFooter className="pt-4">
                    <Button type="submit" disabled={isResetLoading} className="w-full">
                        {isResetLoading && <LoadingSpinner size={20} className="mr-2"/>}
                        Send Reset Email
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
}
