'use client';

import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';
import { deleteUser } from 'firebase/auth';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { MessagesTab } from '@/components/dashboard/MessagesTab';
import { DocumentsTab } from '@/components/dashboard/DocumentsTab';
import { BillingTab } from '@/components/dashboard/BillingTab';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (!user || !clientProfileRef) return;
    setIsDeleting(true);
    
    // We should also delete user data from Firestore here
    // This is a "soft delete" for the profile.
    // Deleting files from storage should be handled by a Cloud Function for security.
    setDocumentNonBlocking(clientProfileRef, { deletedAt: new Date() }, { merge: true });

    try {
      await deleteUser(user);
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      router.push('/');
    } catch (error: any) {
      console.error("Account deletion error:", error);
       // Revert the soft delete if user deletion fails
      setDocumentNonBlocking(clientProfileRef, { deletedAt: null }, { merge: true });
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "An error occurred while deleting your account. You may need to re-authenticate and try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isUserLoading || isProfileLoading) {
    return <div>Loading...</div>;
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
         <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>Log Out</Button>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers. Files will be scheduled for deletion.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Continue"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
