import Link from "next/link";
import { Mountain, Phone, Mail, MapPin } from "lucide-react";

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
                <a href="tel:+260972088113" className="hover:text-primary break-all">+260 972 088 113</a>
             </div>
             <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0"/>
                <a href="mailto:mosesmwanakombo890@gmail.com" className="hover:text-primary break-all">mosesmwanakombo890@gmail.com</a>
             </div>
             <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-primary flex-shrink-0"
                >
                  <path
                    d="M19.05 4.94C17.13 3.03 14.68 2 12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.45 1.29 4.95L2 22l5.05-1.29c1.5.83 3.18 1.29 4.95 1.29h.01c5.52 0 10-4.48 10-10c0-2.68-1.03-5.13-2.95-7.06zm-7.04 15.01c-1.67 0-3.27-.45-4.63-1.29l-.33-.19-3.44.88.89-3.36-.21-.35c-.92-1.44-1.4-3.12-1.4-4.88 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.5-5.25c-.28-.14-1.65-.81-1.91-.9-.26-.09-.45-.14-.64.14-.19.28-.72.9-.88 1.08-.16.18-.32.2-.59.07-.27-.13-1.14-.42-2.17-1.34-.8-.72-1.34-1.62-1.49-1.89-.15-.27-.02-.42.12-.56.13-.13.28-.33.42-.5.14-.16.19-.28.28-.46.1-.19.05-.35-.02-.5-.07-.14-.64-1.54-.88-2.1-.23-.55-.47-.48-.64-.48-.17 0-.37-.03-.56-.03-.19 0-.5.07-.76.35-.26.28-.98.96-.98 2.34s1.01 2.71 1.15 2.9c.14.19 1.98 3.01 4.8 4.23.67.29 1.2.46 1.61.59.69.18 1.32.16 1.82.1.55-.06 1.65-.67 1.88-1.32.24-.65.24-1.21.17-1.32-.07-.11-.26-.18-.54-.32z"
                  />
                </svg>
                <a href="https://wa.me/260966760868" target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all">+260 966 760 868</a>
             </div>
             <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                <p>Silverest, Chongwe, Lusaka Zmabia</p>
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
