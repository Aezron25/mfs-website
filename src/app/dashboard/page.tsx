
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
        <div className="container py-12">
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="mt-8">
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="container py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
          Welcome, {user.displayName || 'User'}
        </h1>
        <p className="text-muted-foreground md:text-xl">
          This is your personal dashboard. More features coming soon!
        </p>
      </div>
      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                    Here is some of your information stored in our system.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p><strong className="font-medium text-foreground">Name:</strong> {user.displayName}</p>
                <p><strong className="font-medium text-foreground">Email:</strong> {user.email}</p>
                <p><strong className="font-medium text-foreground">User ID:</strong> {user.uid}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    