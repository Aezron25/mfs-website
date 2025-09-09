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
                    fillRule="evenodd"
                    d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.976 8.974 0 1.582.413 3.126 1.198 4.488L3 21l4.629-1.224a8.948 8.948 0 0 0 4.424 1.182h.004c4.947 0 8.975-4.027 8.975-8.973a8.926 8.926 0 0 0-2.629-6.332Zm-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.289a7.448 7.448 0 0 1-1.141-3.971c0-4.108 3.344-7.451 7.452-7.451a7.425 7.425 0 0 1 5.27 2.185 7.43 7.43 0 0 1 2.183 5.27c0 4.108-3.343 7.452-7.451 7.452Zm4.218-5.385c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.354.1-.466c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a.965.965 0 0 0-.428-.056h-.047a.784.784 0 0 0-.573.262c-.21.21-.798.785-.798 1.918s.818 2.222.93 2.372c.112.15 1.616 2.477 3.919 3.469.575.245 1.031.393 1.396.504.546.169.986.145 1.362.088.42-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.066s-.205-.15-.43-.262Z"
                    clipRule="evenodd"
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
