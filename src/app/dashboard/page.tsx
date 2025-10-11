'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

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

  if (isUserLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-lg text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
          Welcome to Your Dashboard
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Hello, {user.email}! This is your protected dashboard area.
        </p>
        <Button onClick={handleLogout}>Log Out</Button>
      </div>
    </div>
  );
}
