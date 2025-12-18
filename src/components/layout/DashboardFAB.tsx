
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DashboardFAB() {
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  // @ts-ignore - role is a custom property we add
  const userRole = user?.role;

  // Don't show if user is not logged in, not a client, or already on a dashboard/admin page
  if (isLoading || !user || userRole !== 'client' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            className={cn(
              'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40',
              'transition-opacity duration-300',
               !isLoading && user ? 'opacity-100' : 'opacity-0'
            )}
            aria-label="Go to Dashboard"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-6 w-6" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Go to Dashboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
