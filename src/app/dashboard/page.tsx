'use client';

import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
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
    if (!user) return;
    setIsDeleting(true);
    try {
      // We should also delete user data from Firestore here
      if (clientProfileRef) {
        await setDoc(clientProfileRef, { deleted: true }, { merge: true });
      }
      await deleteUser(user);
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      router.push('/');
    } catch (error: any) {
      console.error("Account deletion error:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "An error occurred while deleting your account. You may need to log in again to complete this action.",
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
            Welcome back, {user.email}. Manage your profile and communications here.
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
                    account and remove your data from our servers.
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
          <TabsTrigger value="documents" disabled>Documents</TabsTrigger>
          <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
            <ProfileForm user={user} profile={clientProfile} />
        </TabsContent>
         <TabsContent value="messages">
            <MessagesTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
