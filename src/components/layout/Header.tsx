
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/firebase/auth/use-user";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const clientNavItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/service-requests", label: "Service Requests" },
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
        <path d="M4 4H8V20H4V4Z" fill="currentColor"/>
        <path d="M8 4H12L16 12L20 4H24V20H20V8L16 16L12 8V20H8V4Z" fill="currentColor" />
        <path d="M4 12H8V16H4V12Z" fill="currentColor"/>
    </svg>
)

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  // This is a placeholder for role checking.
  // In a real app, you would get this from custom claims on the user object.
  // @ts-ignore
  const userRole = user?.role || 'client'; // Default to client for display purposes

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };


  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Do not show header on admin routes for non-mobile
  if (pathname.startsWith('/admin') && !isMobile) {
      return null;
  }

  const NavLink = ({ href, label, className, onClick }: { href: string; label: string, className?: string, onClick?: () => void }) => (
    <Link
      href={href}
      onClick={() => {
        setIsMobileMenuOpen(false);
        onClick?.();
      }}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground",
        className
      )}
    >
      {label}
    </Link>
  );

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getNavItems = () => {
      if (!user) return navItems;
      // @ts-ignore
      if (user.role === 'admin' || user.role === 'staff') {
        return [{ href: "/admin", label: "Admin Dashboard" }];
      }
      return clientNavItems;
  }

  const currentNavItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <MfsLogo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Mwanakombo Financial Services
            </span>
            <span className="sm:hidden font-bold font-headline text-base">MFS</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
           {isClient && isMobile ? (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Navigation links for Mwanakombo's financial services.
                    </SheetDescription>
                  </SheetHeader>
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <MfsLogo className="h-6 w-6 text-primary" />
                    <span className="font-bold sm:inline-block font-headline">
                      Mwanakombo Financial Services
                    </span>
                  </Link>
                  <div className="grid gap-2 py-6">
                      {currentNavItems.map((item) => (
                        <NavLink key={item.href} {...item} className="text-lg py-2" />
                      ))}
                  </div>
                  <div className="border-t pt-4">
                     {user ? (
                        <Button onClick={handleLogout} className="w-full justify-start">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log Out
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                           <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                              <Link href="/login">Login</Link>
                           </Button>
                           <Button asChild variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                              <Link href="/signup">Sign Up</Link>                           
                           </Button>
                        </div>
                      )}
                  </div>
                </SheetContent>
              </Sheet>
          ) : (
             <div className="flex items-center gap-6">
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    {currentNavItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                    ))}
                </nav>
                 <div className="flex items-center gap-4">
                  {!isLoading && (
                    <>
                      {user ? (
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                              </Avatar>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Log out</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href="/login">Login</Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link href="/signup">Sign Up</Link>
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
