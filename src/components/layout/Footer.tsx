import Link from "next/link";
import { Phone, Mail, MapPin, Linkedin } from "lucide-react";

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

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    fill="currentColor"
    {...props}
  >
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
);


export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-start gap-4 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <MfsLogo className="h-6 w-6 text-primary" />
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
                <a href="mailto:mosesmwanakombo890@gmail.com" className="hover:text-primary break-all">Send an Email</a>
             </div>
             <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                  className="h-5 w-5 text-primary flex-shrink-0"
                >
                  <path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
                <a href="https://wa.me/260966760868" target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all">+260 966 760 868</a>
             </div>
             <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-primary flex-shrink-0"/>
                <a href="https://www.linkedin.com/in/moses-mwanakombo-a1a9572b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all">LinkedIn</a>
             </div>
             <div className="flex items-center gap-3">
                <FacebookIcon className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="https://www.facebook.com/share/1Cvhna9TJZ/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary break-all"
                >
                  Facebook
                </a>
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
