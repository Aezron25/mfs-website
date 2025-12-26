
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  {
    href: '/admin/service-requests',
    label: 'Service Requests',
    icon: Briefcase,
  },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
];

const MfsLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4 4H8V20H4V4Z" fill="currentColor" />
    <path
      d="M8 4H12L16 12L20 4H24V20H20V8L16 16L12 8V20H8V4Z"
      fill="currentColor"
    />
    <path d="M4 12H8V16H4V12Z" fill="currentColor" />
  </svg>
);

function AdminLoadingSkeleton() {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden md:flex flex-col w-64 border-r p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
        </div>
        <div className="flex-1 flex flex-col">
            <header className="flex items-center p-4 border-b h-14">
               <Skeleton className="h-8 w-8 md:hidden" />
               <Skeleton className="h-8 w-32 ml-2" />
            </header>
            <main className="flex-1 p-8">
                <Skeleton className="h-full w-full" />
            </main>
        </div>
      </div>
    );
}

function AccessDenied() {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="text-center p-8">
               <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
               <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
               <Button asChild variant="link" className="mt-4">
                   <Link href="/dashboard">Go to your Dashboard</Link>
               </Button>
            </div>
        </div>
    )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  // @ts-ignore - In a real app, use custom claims. For now, we add this to the user object.
  const userRole = user?.role;

  useEffect(() => {
    // If finished loading and there's no user, redirect to login.
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  // While loading, show a full-page skeleton to prevent flashes of content.
  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  // If user is loaded but is a 'client', deny access.
  if (user && userRole === 'client') {
     return <AccessDenied />;
  }

  // If user is loaded and has a valid admin/staff role, render the layout.
  // We also check for `!user` again to handle the brief moment after logout before redirect.
  if (!user || (userRole !== 'admin' && userRole !== 'staff')) {
      // This state can happen briefly (e.g., after logout). 
      // Showing the skeleton prevents showing a broken UI before redirect.
      return <AdminLoadingSkeleton />;
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <MfsLogo className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground group-data-[collapsible=icon]:hidden">
              Admin Panel
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={{ children: 'Settings' }}
                isActive={pathname === '/admin/settings'}
              >
                <Link href="/admin/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Log Out' }}>
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b h-14">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden"/>
                <h1 className="text-xl font-semibold tracking-tight">{adminNavItems.find(item => item.href === pathname)?.label || 'Admin'}</h1>
            </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
