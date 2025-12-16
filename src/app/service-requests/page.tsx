'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { serviceRequest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  serviceType: z.string().min(1, 'Please select a service type.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.')
    .max(500, 'Description must be less than 500 characters.'),
});

const availableServices = [
  'Audit Services',
  'Tax Services',
  'Consultancy Services',
  'Personal Finance',
];

function NewRequestForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: '',
      description: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to submit a request.',
      });
      return;
    }

    try {
      await addDoc(collection(firestore, 'serviceRequests'), {
        ...values,
        clientId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Request Submitted!',
        description: 'Your service request has been sent successfully.',
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not submit your request.',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Service Request</CardTitle>
        <CardDescription>Fill out the form below to request a new service.</CardDescription>
      </CardHeader>
      <CardContent>
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
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableServices.map((service) => (
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe the service you need..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide as much detail as possible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
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
      </CardContent>
    </Card>
  );
}

function RequestHistory() {
    const { user } = useUser();
    const firestore = useFirestore();

    const requestsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, 'serviceRequests'),
            where('clientId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
    }, [user, firestore]);

    const { data: requests, loading, error } = useCollection<serviceRequest>(requestsQuery);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>Here is a list of all your past and current service requests.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                )}
                {!loading && !error && requests.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assigned Staff</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        {req.createdAt instanceof Date ? req.createdAt.toLocaleDateString() : 
                                         (req.createdAt as any)?.seconds ? new Date((req.createdAt as any).seconds * 1000).toLocaleDateString() : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell className="font-medium">{req.serviceType}</TableCell>
                                    <TableCell>
                                        <Badge variant={req.status === 'completed' ? 'default' : 'secondary'}>{req.status}</Badge>
                                    </TableCell>
                                    <TableCell>{req.assignedStaff || 'Unassigned'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                 {!loading && !error && requests.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">You have not made any requests yet.</p>
                )}
                {error && (
                    <p className="text-center text-destructive py-8">Could not load request history.</p>
                )}
            </CardContent>
        </Card>
    )
}

export default function ServiceRequestsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
        <div className="container py-12">
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-1">
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="lg:col-span-2">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
          Service Requests
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
          Manage your service requests. Submit a new request or track the status of existing ones.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
            <NewRequestForm />
        </div>
        <div className="lg:col-span-2">
            <RequestHistory />
        </div>
      </div>
    </div>
  );
}
