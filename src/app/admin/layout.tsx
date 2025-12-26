
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
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

function AdminSkeleton() {
    return (
      <div className="flex h-screen w-full bg-background">
        <div className="hidden md:flex flex-col gap-4 border-r p-2">
            <div className="flex h-14 items-center gap-2 p-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex flex-col gap-2 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
        <div className="flex-1 p-8">
            <Skeleton className="h-10 w-48 mb-8" />
            <Skeleton className="h-[calc(100%-5rem)] w-full" />
        </div>
      </div>
    );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // This is a placeholder for role checking. In a real app, this should come from verified ID token claims.
  // @ts-ignore
  const userRole = user?.role; 

  useEffect(() => {
    if (isLoading) {
      return; // Wait until user status is resolved
    }
    if (!user) {
      router.replace('/login'); // Not logged in, redirect to login
    } else if (userRole && userRole === 'client') {
      router.replace('/dashboard'); // Logged in as a client, redirect to client dashboard
    }
  }, [user, isLoading, router, userRole]);

  const handleLogout = async () => {
    try {
        const auth = getAuth();
        await signOut(auth);
        router.replace('/');
    } catch(e) {
        console.error("Logout failed", e);
    }
  };

  // While loading or if the user is not yet determined to be an admin/staff, show a skeleton.
  if (isLoading || !user || userRole === 'client' || !userRole) {
    return <AdminSkeleton />;
  }

  const currentNavItem = adminNavItems.find(item => pathname === item.href || pathname.startsWith(item.href + '/')) || { label: 'Admin' };

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
                <h1 className="text-xl font-semibold tracking-tight">{currentNavItem.label}</h1>
            </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
