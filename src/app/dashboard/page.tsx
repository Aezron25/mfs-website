'use client';

import { useUser, useAuth, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { MessagesTab } from '@/components/dashboard/MessagesTab';
import { DocumentsTab } from '@/components/dashboard/DocumentsTab';
import { BillingTab } from '@/components/dashboard/BillingTab';
import { useDoc, useFirestore } from '@/firebase';


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  
  const clientProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'client_profiles', user.uid);
  }, [firestore, user]);

  const { data: clientProfile, isLoading: isProfileLoading } = useDoc(clientProfileRef);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };

  if (isUserLoading || isProfileLoading) {
    return <div className="container py-12">Loading...</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="container py-12 md:py-16 lg:py-20">
       <div className="flex justify-between items-center mb-8">
        <div className='space-y-1.5'>
          <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl font-headline">
            Client Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Welcome back, {clientProfile?.firstName || user.email}. Manage your profile and documents here.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
            <ProfileForm user={user} profile={clientProfile} />
        </TabsContent>
         <TabsContent value="messages">
            <MessagesTab user={user} />
        </TabsContent>
        <TabsContent value="documents">
            <DocumentsTab user={user} />
        </TabsContent>
        <TabsContent value="billing">
            <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
