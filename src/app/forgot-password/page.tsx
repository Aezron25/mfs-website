
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: 'Check your email',
        description: 'A password reset link has been sent to your email address.',
      });
      form.reset();
    } catch (error: any) {
      console.error(error);
      let description = 'There was a problem sending the reset email.';
       if (error.code === 'auth/user-not-found') {
        description = 'No user found with this email address.';
      }
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description,
      });
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            Forgot Password
          </h1>
          <p className="text-muted-foreground">
            Enter your email to receive a password reset link.
          </p>
        </div>
        <div className="border rounded-lg p-8 shadow-md bg-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </Form>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground mt-6">
          Remember your password?{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
