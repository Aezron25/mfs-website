'use client';

import { useUser, useAuth, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getFirestore } from 'firebase/firestore';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendEmailVerification } from 'firebase/auth';


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  
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

  const handleResendVerification = async () => {
    if (!user) return;
    setIsSendingVerification(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox (and spam folder) for the verification link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Send Email",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSendingVerification(false);
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
      
      {!user.emailVerified && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verify Your Email Address</AlertTitle>
          <AlertDescription>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p>Please check your inbox to verify your email. This is required to ensure your account is secure.</p>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleResendVerification} 
                    disabled={isSendingVerification}
                    className="mt-2 sm:mt-0"
                >
                    {isSendingVerification && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Resend Verification Email
                </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
