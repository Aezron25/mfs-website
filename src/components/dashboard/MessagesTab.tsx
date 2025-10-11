'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User } from 'firebase/auth';
import { collection, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';

import {
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, MessageSquareText } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const messageSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters.'),
  body: z.string().min(10, 'Message body must be at least 10 characters.'),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface MessagesTabProps {
  user: User;
}

export function MessagesTab({ user }: MessagesTabProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const messagesRef = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'client_profiles', user.uid, 'messages');
  }, [firestore, user]);

  const { data: messages, isLoading: messagesLoading } = useCollection(messagesRef);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      subject: '',
      body: '',
    },
  });

  const { isSubmitting, isDirty, isValid } = form.formState;

  const onSubmit = (data: MessageFormValues) => {
    if (!messagesRef) return;

    addDocumentNonBlocking(messagesRef, {
      ...data,
      clientProfileId: user.uid,
      sentAt: serverTimestamp(),
    }).catch(e => {
        toast({
            variant: 'destructive',
            title: 'Message Failed',
            description: 'There was an error sending your message. Please try again.',
        });
    });

    toast({
      title: 'Message Sent!',
      description: 'Your message has been sent successfully.',
    });
    form.reset();
  };
  
  const sortedMessages = messages ? [...messages].sort((a, b) => {
    if (a.sentAt && b.sentAt) {
      return b.sentAt.toMillis() - a.sentAt.toMillis();
    }
    return 0;
  }) : [];


  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>New Message</CardTitle>
          <CardDescription>
            Send a secure message directly to Mwanakombo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Question about Tax Services"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your message here..."
                        className="min-h-[150px]"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !isDirty || !isValid}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Send Message
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sent Messages</CardTitle>
          <CardDescription>
            View your conversation history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messagesLoading && (
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
          )}
          {!messagesLoading && sortedMessages && sortedMessages.length > 0 ? (
             <Accordion type="single" collapsible className="w-full">
                {sortedMessages.map((msg) => (
                    <AccordionItem value={msg.id} key={msg.id}>
                        <AccordionTrigger>
                           <div className="flex justify-between items-center w-full pr-4">
                             <span className="font-medium truncate">{msg.subject}</span>
                             <span className="text-sm text-muted-foreground flex-shrink-0">
                                {msg.sentAt ? format(msg.sentAt.toDate(), 'PPP') : 'Sending...'}
                             </span>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className='whitespace-pre-wrap text-muted-foreground'>
                            {msg.body}
                        </AccordionContent>
                    </AccordionItem>
                ))}
             </Accordion>
          ) : null}

           {!messagesLoading && (!sortedMessages || sortedMessages.length === 0) && (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                <MessageSquareText className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">No Messages Yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Your sent messages will appear here.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}