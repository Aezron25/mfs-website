import Link from "next/link";
import { Mountain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Mountain className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; {new Date().getFullYear()} Mwanakombo Financial Services. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link href="/services" className="text-sm hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/about" className="text-sm hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
