'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users,
  Briefcase,
  Calendar,
  FileText,
  Settings,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { type AppUser } from '@/firebase/auth/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { getAuth, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/clients',
    label: 'Clients',
    icon: Users,
  },
  {
    href: '/admin/service-requests',
    label: 'Service Requests',
    icon: Briefcase,
  },
  {
    href: '/admin/appointments',
    label: 'Appointments',
    icon: Calendar,
  },
  {
    href: '/admin/documents',
    label: 'Documents',
    icon: FileText,
  },
    {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

function UserProfile({ user }: { user: AppUser }) {
    if (!user) return null;
    const fallback = user.displayName?.charAt(0) || user.email?.charAt(0) || 'A';
    return (
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm truncate">{user.displayName}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
        </div>
    )
}

export function AdminSidebar({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AppUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "There was a problem logging you out. Please try again.",
      });
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <UserProfile user={user} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
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
            <div className="w-full flex items-center gap-2">
                <Button asChild variant="outline" className="flex-1">
                    <Link href="/">Back to Site</Link>
                </Button>
                <Button onClick={handleLogout} variant="outline" size="icon" aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h1 className="text-lg font-semibold md:text-xl">
                    {menuItems.find(item => item.href === pathname)?.label || "Admin"}
                </h1>
            </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
