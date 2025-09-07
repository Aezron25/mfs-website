import Link from "next/link";
import { Mountain, Phone, Mail, MapPin, Smartphone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-start gap-4 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">
                Mwanakombo Financial Services (MFS)
              </span>
            </Link>
             <p className="text-sm">
              &copy; {new Date().getFullYear()} Mwanakombo Financial Services. All rights reserved.
            </p>
          </div>
          <div className="space-y-4 lg:col-start-3">
             <h4 className="font-semibold text-foreground">Contact Us</h4>
             <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0"/>
                <a href="tel:0972088113" className="hover:text-primary break-all">0972088113</a>
             </div>
             <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0"/>
                <a href="mailto:mosesmwanakombo890@gmail.com" className="hover:text-primary break-all">mosesmwanakombo890@gmail.com</a>
             </div>
             <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary flex-shrink-0"/>
                <a href="https://wa.me/260966760868" target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all">+260 966 760 868</a>
             </div>
             <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                <p>Silverest chongwe Lusaka, Zambia</p>
             </div>
          </div>
           <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
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
        </div>
      </div>
    </footer>
  );
}
