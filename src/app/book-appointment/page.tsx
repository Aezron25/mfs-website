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
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

const formSchema = z.object({
  date: z.date({
    required_error: 'A date is required.',
  }),
  time: z.string().min(1, { message: 'Please select a time.' }),
  notes: z
    .string()
    .min(10, {
      message: 'Notes must be at least 10 characters.',
    })
    .optional(),
});

export type AppointmentFormValues = z.infer<typeof formSchema>;

export default function BookAppointmentPage() {
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

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        time: '',
        notes: '',
    },
  });

  async function onSubmit(values: AppointmentFormValues) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to book an appointment.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData = {
        clientId: user.uid,
        expertId: 'moses-mwanakombo-expert-id', // Replace with actual expert ID
        date: format(values.date, 'yyyy-MM-dd'),
        time: values.time,
        notes: values.notes || '',
        status: 'pending' as const,
        createdAt: Timestamp.now(),
      };

      const collectionRef = collection(firestore, 'appointments');
      addDoc(collectionRef, appointmentData).catch((error: any) => {
        errorEmitter.emit('permission-error', {
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: appointmentData,
        } as any);
        throw error;
      });

      toast({
        title: 'Appointment Booked!',
        description:
          'Your appointment request has been sent. You will be notified once it is confirmed.',
      });
      form.reset();
      router.push('/dashboard');
    } catch (error: any) {
      if (error.name === 'FirestorePermissionError') {
        // Error is handled by the global listener, no need for a toast here.
        return;
      }
      console.error('Error booking appointment:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not book your appointment. Please try again.',
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
          Book an Appointment
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto">
          Choose a date and time that works for you.
        </p>
      </div>
      <div className="mx-auto max-w-xl border rounded-lg p-8 shadow-md bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setDate(new Date().getDate() - 1)) || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What would you like to discuss?"
                      className="min-h-[100px]"
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
                  Booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
