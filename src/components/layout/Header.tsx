
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/firebase/auth/use-user";


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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const { user, isLoading } = useUser();

  // @ts-ignore
  const userRole = user?.role;
  const isAdmin = userRole === 'roles_admin';

  useEffect(() => {
    setIsClient(true);
  }, []);

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
                      {navItems.map((item) => (
                        <NavLink key={item.href} {...item} className="text-lg py-2" />
                      ))}
                      <div className="border-t pt-4 mt-4 space-y-2">
                        {!isLoading && user ? (
                           <>
                             {isAdmin ? (
                                <NavLink href="/admin" label="Admin" className="text-lg py-2" />
                             ) : (
                               <NavLink href="/dashboard" label="Dashboard" className="text-lg py-2" />
                             )}
                           </>
                        ) : (
                          <>
                           {!isLoading && (
                             <>
                                <NavLink href="/login" label="Login" className="text-lg py-2"/>
                                <NavLink href="/signup" label="Sign Up" className="text-lg py-2"/>
                             </>
                           )}
                          </>
                        )}
                      </div>
                  </div>
                </SheetContent>
              </Sheet>
          ) : (
             <div className="flex items-center gap-6">
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    {navItems.map((item) => (
                      <NavLink key={item.href} {...item} />
                    ))}
                </nav>
                 <div className="flex items-center gap-2">
                    {isLoading ? null : user ? (
                      <>
                        {isAdmin ? (
                          <Button asChild variant="outline" size="sm">
                             <Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4"/>Admin</Link>
                          </Button>
                        ) : (
                           <Button asChild variant="ghost" size="sm">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button asChild variant="ghost" size="sm">
                           <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild size="sm">
                           <Link href="/signup">Sign Up</Link>
                        </Button>
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
