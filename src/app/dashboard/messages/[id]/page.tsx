
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { Conversation, Message } from '@/lib/types';
import { useUser } from '@/firebase/auth/use-user';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

function ChatBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
    const timestamp = message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
        <div className={cn("flex items-end gap-2", isOwn ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-md rounded-lg p-3", isOwn ? "bg-primary text-primary-foreground" : "bg-muted")}>
                <p className="text-sm">{message.text}</p>
                 <p className={cn("text-xs mt-1", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>{timestamp}</p>
            </div>
        </div>
    );
}

export default function ClientChatPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const firestore = useFirestore();
    const { user, isLoading: userLoading } = useUser();

    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversationRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'conversations', id);
    }, [firestore, id]);

    const messagesQuery = useMemoFirebase(() => {
        if (!conversationRef) return null;
        return query(collection(conversationRef, 'messages'), orderBy('createdAt'));
    }, [conversationRef]);

    const { data: convData, loading: conversationLoading } = useDoc<Conversation>(conversationRef);
    const { data: messages, loading: messagesLoading } = useCollection<Message>(messagesQuery);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !messagesQuery) return;
        
        const text = newMessage;
        setNewMessage('');

        await addDoc(collection(firestore!, 'conversations', id, 'messages'), {
            senderId: user.uid,
            text,
            createdAt: serverTimestamp(),
            read: false,
        });

        if (conversationRef) {
            await updateDoc(conversationRef, {
                lastMessage: text,
                lastMessageAt: serverTimestamp(),
            });
        }
    };
    
    const otherParticipantId = convData?.participants.find(p => p !== user?.uid);
    const otherParticipantName = otherParticipantId ? convData?.participantNames[otherParticipantId] || "Financial Expert" : 'Financial Expert';
    const otherParticipantImage = otherParticipantId ? convData?.participantImages?.[otherParticipantId] : '';

    const loading = userLoading || conversationLoading;

    if (!loading && convData && !convData.participants.includes(user?.uid || '')) {
         router.push('/dashboard');
         return <div className="text-center py-12">Unauthorized</div>
    }

    return (
        <div className="container py-12 md:py-24 lg:py-32">
            <Card className="max-w-3xl mx-auto flex flex-col h-[70vh]">
                <header className="flex items-center gap-4 border-b bg-muted/40 p-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/messages')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={otherParticipantImage} />
                                <AvatarFallback>{otherParticipantName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">{otherParticipantName}</h2>
                        </div>
                    )}
                </header>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                     {messagesLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-3/4" />
                            <Skeleton className="h-16 w-3/4 ml-auto" />
                            <Skeleton className="h-16 w-3/4" />
                        </div>
                    ) : messages && messages.length > 0 ? (
                        messages.map(msg => (
                            <ChatBubble key={msg.id} message={msg} isOwn={msg.senderId === user?.uid} />
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            <p>This is the beginning of your conversation.</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>
                <footer className="border-t p-4">
                     <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim() || loading}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </footer>
            </Card>
        </div>
    );
}
