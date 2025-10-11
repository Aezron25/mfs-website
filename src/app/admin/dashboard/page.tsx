'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdmin(user);
  const router = useRouter();

  useEffect(() => {
    // If user and admin state have loaded...
    if (!isUserLoading && !isAdminLoading) {
      // And there's no user OR the user is not an admin...
      if (!user || !isAdmin) {
        // Redirect them away.
        router.push('/');
      }
    }
  }, [user, isAdmin, isUserLoading, isAdminLoading, router]);

  // Show a loading state while we verify the user's admin status
  if (isUserLoading || isAdminLoading) {
    return <div>Verifying credentials...</div>;
  }

  // If the user is an admin, show the dashboard.
  // Otherwise, this will be null and the useEffect will handle redirection.
  return isAdmin ? (
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
          <CardTitle>Admin Features</CardTitle>
          <CardDescription>
            This section is only visible to administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have administrative privileges. More features coming soon!</p>
        </CardContent>
      </Card>
    </div>
  ) : null;
}
