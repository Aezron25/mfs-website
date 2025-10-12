'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection } from 'firebase/firestore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdmin(user);
  const router = useRouter();
  const firestore = useFirestore();

  const clientProfilesRef = useMemoFirebase(
    () => (isAdmin ? collection(firestore, 'client_profiles') : null),
    [firestore, isAdmin]
  );
  
  const { data: clientProfiles, isLoading: isProfilesLoading } = useCollection(clientProfilesRef);

  useEffect(() => {
    if (!isUserLoading && !isAdminLoading) {
      if (!user || !isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, isUserLoading, isAdminLoading, router]);

  if (isUserLoading || isAdminLoading) {
    return <div className="container py-12">Verifying credentials...</div>;
  }
  
  if (!isAdmin) {
    return null; // or a redirect component
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <div className="space-y-1.5 mb-8">
        <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl font-headline">
          Administrator Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Welcome, {user?.email}. Manage your application from here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
          <CardDescription>
            View and manage all registered clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isProfilesLoading && (
                  <>
                    <TableRow>
                      <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[220px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  </>
                )}
                {!isProfilesLoading && clientProfiles?.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarFallback>
                          {getInitials(profile.firstName, profile.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {profile.firstName} {profile.lastName}
                    </TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" disabled>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Client options</span>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isProfilesLoading && (!clientProfiles || clientProfiles.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No clients found.
                        </TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
