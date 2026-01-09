'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import type { Conversation } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function ClientMessagesPage() {
  const firestore = useFirestore();
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const conversationsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
        collection(firestore, 'conversations'), 
        where('participants', 'array-contains', user.uid),
        orderBy('lastMessageAt', 'desc')
    );
  }, [firestore, user?.uid]);

  const { data: conversations, loading: conversationsLoading } = useCollection<Conversation>(conversationsQuery);
  
  const loading = userLoading || conversationsLoading;
  
  const getOtherParticipant = (conv: Conversation) => {
    if (!user) return { name: 'Expert', image: '' };
    const otherId = conv.participants.find(p => p !== user.uid);
    if (!otherId) return { name: 'Conversation', image: '' };
    return {
        name: conv.participantNames[otherId] || 'Financial Expert',
        image: conv.participantImages?.[otherId] || '',
    };
  };

  return (
    <div className="container py-12 md:py-24 lg:py-32">
       <div className="space-y-6 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
          My Messages
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto">
          View and respond to conversations with your financial expert.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>All Conversations</CardTitle>
          <CardDescription>
            Select a conversation to view messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))
            ) : conversations && conversations.length > 0 ? (
              conversations.map((conv) => {
                 const otherParticipant = getOtherParticipant(conv);
                return (
                  <div
                    key={conv.id}
                    onClick={() => router.push(`/dashboard/messages/${conv.id}`)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherParticipant.image} alt={otherParticipant.name} />
                      <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 truncate">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold truncate">{otherParticipant.name}</h3>
                         <p className="text-xs text-muted-foreground">
                            {conv.lastMessageAt ? formatDistanceToNow(conv.lastMessageAt.toDate(), { addSuffix: true }) : ''}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <p>You have no conversations yet.</p>
                <Button variant="link" onClick={() => router.push('/contact')}>Contact us to start a conversation</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
