'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, deleteUser } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required.'),
  lastName: z.string().min(2, 'Last name is required.'),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
  profile: any;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || '',
      companyName: profile?.companyName || '',
      address: profile?.address || '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    try {
      const profileRef = doc(firestore, 'client_profiles', user.uid);
      await setDoc(profileRef, {
        ...data,
        id: user.uid, // Explicitly set the ID
        email: user.email, // Keep email in sync
        updatedAt: serverTimestamp(),
        createdAt: profile?.createdAt || serverTimestamp(), // Preserve original creation date
      }, { merge: true });

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved successfully.',
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    
    const clientProfileRef = doc(firestore, 'client_profiles', user.uid);
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


  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          Update your personal and company information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 890" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Anytown" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex flex-col items-start gap-4">
          <div>
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
                This action is not reversible. Please be certain.
            </p>
          </div>
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
                  <AlertDialogAction 
                    onClick={handleDeleteAccount} 
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive/90"
                    >
                    {isDeleting ? "Deleting..." : "Continue"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
      </CardFooter>
    </Card>
  );
}
