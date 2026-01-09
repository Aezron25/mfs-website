'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, where, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Conversation, UserProfile } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { formatDistanceToNow } from 'date-fns';

function NewConversationDialog({ adminId }: { adminId: string }) {
  const firestore = useFirestore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), where('role', '==', 'user'));
  }, [firestore]);

  const { data: clients, loading } = useCollection<UserProfile>(usersQuery);

  const handleSelectClient = async (client: UserProfile) => {
    if (!firestore || !adminId) return;

    // Check if a conversation already exists
    const existingConvoQuery = query(
      collection(firestore, 'conversations'),
      where('participants', 'array-contains', adminId),
    );
    const querySnapshot = await getDocs(existingConvoQuery);
    let existingConvId: string | null = null;
    querySnapshot.forEach(doc => {
      const conv = doc.data() as Conversation;
      if (conv.participants.includes(client.id)) {
        existingConvId = doc.id;
      }
    });

    if (existingConvId) {
      router.push(`/admin/messages/${existingConvId}`);
      return;
    }

    // Create new conversation
    const newConvRef = await addDoc(collection(firestore, 'conversations'), {
      participants: [adminId, client.id],
      participantNames: {
        [adminId]: 'Admin',
        [client.id]: client.name
      },
      participantImages: {},
      lastMessage: 'Conversation started',
      lastMessageAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    setOpen(false);
    router.push(`/admin/messages/${newConvRef.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Start a New Conversation</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search for a client..." />
          <CommandList>
            <CommandEmpty>{loading ? 'Loading clients...' : 'No clients found.'}</CommandEmpty>
            <CommandGroup>
              {clients?.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.name}
                  onSelect={() => handleSelectClient(client)}
                  className="flex items-center gap-3"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  <span>{client.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMessagesPage() {
  const firestore = useFirestore();
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const conversationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'conversations'), orderBy('lastMessageAt', 'desc'));
  }, [firestore]);

  const { data: conversations, loading: conversationsLoading } = useCollection<Conversation>(conversationsQuery);
  
  const loading = userLoading || conversationsLoading;

  const getOtherParticipant = (conv: Conversation) => {
    if (!user) return { name: 'Unknown', image: '' };
    const otherId = conv.participants.find(p => p !== user.uid);
    if (!otherId) return { name: 'Conversation', image: '' };
    return {
        name: conv.participantNames[otherId] || 'Unknown User',
        image: conv.participantImages?.[otherId] || '',
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Messages
            </h1>
            <p className="text-muted-foreground">
            Manage all client conversations.
            </p>
        </div>
        {user && <NewConversationDialog adminId={user.uid} />}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
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
                    onClick={() => router.push(`/admin/messages/${conv.id}`)}
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
                <p>No conversations yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
