
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser, useAuth } from "@/firebase";
import { useAdmin } from "@/hooks/use-admin";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const { user, isUserLoading } = useUser();
  const { isAdmin } = useAdmin(user);
  const auth = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    }
    setIsMobileMenuOpen(false);
    router.push('/');
  };

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

  const AuthButtons = () => {
    if (isUserLoading) {
      return null;
    }
    if (user) {
      return (
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={isAdmin ? "/admin/dashboard" : "/dashboard"}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
            <LogOut className="ml-2 h-4 w-4"/>
          </Button>
        </div>
      );
    }
    return null;
  };
  
  const MobileAuthButtons = () => {
     if (isUserLoading) {
      return null;
    }
    if (user) {
      return (
        <>
            <NavLink href={isAdmin ? "/admin/dashboard" : "/dashboard"} label="Dashboard" className="text-lg py-2" />
            <button
              onClick={handleLogout}
              className="text-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center w-full"
            >
              Logout
              <LogOut className="ml-2 h-4 w-4"/>
            </button>
        </>
      );
    }
    return null;
  }

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

        <div className="flex flex-1 items-center justify-end space-x-4">
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
                      {navItems.map((item) => (
                        <NavLink key={item.href} {...item} className="text-lg py-2" />
                      ))}
                      <hr className="my-2"/>
                      <MobileAuthButtons />
                  </div>
                </SheetContent>
              </Sheet>
          ) : (
             <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {navItems.map((item) => (
                    <NavLink key={item.href} {...item} />
                    ))}
                </nav>
                <AuthButtons />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
