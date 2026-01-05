
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';
import { Skeleton } from '@/components/ui/skeleton';


const services = [
    "Audit Services",
    "Tax Services",
    "Consultancy Services",
    "Personal Finance",
];

const formSchema = z.object({
  serviceType: z.string().min(1, { message: "Please select a service type." }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
});

export type ServiceRequestFormValues = z.infer<typeof formSchema>;

export default function ServiceRequestPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

   useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const form = useForm<ServiceRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: '',
      description: '',
    },
  });

  async function onSubmit(values: ServiceRequestFormValues) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to submit a request.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
        const requestData = {
            clientId: user.uid,
            serviceType: values.serviceType,
            description: values.description,
            status: 'pending' as const,
            createdAt: Timestamp.now(),
        };

      const collectionRef = collection(firestore, 'serviceRequests');
      addDoc(collectionRef, requestData)
        .catch((error: any) => {
            errorEmitter.emit('permission-error', {
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: requestData
            } as any);
            throw error;
        });

      toast({
        title: 'Request Submitted!',
        description: 'Your service request has been sent successfully. We will get back to you shortly.',
      });
      form.reset();
      router.push('/dashboard');

    } catch (error: any) {
        if (error.name === 'FirestorePermissionError') {
            // Error is handled by the global listener, no need for a toast here.
            return;
        }
        console.error('Error submitting service request:', error);
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'Could not submit your request. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (userLoading || !user) {
    return (
        <div className="container py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-xl space-y-8">
                <div className="space-y-2 text-center">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                </div>
                 <div className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="space-y-6 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
          Submit a Service Request
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto">
          Let us know what you need help with, and we'll get back to you as soon as possible.
        </p>
      </div>
      <div className="mx-auto max-w-xl border rounded-lg p-8 shadow-md bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {services.map(service => (
                            <SelectItem key={service} value={service}>
                                {service}
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe Your Request</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide as much detail as possible..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
