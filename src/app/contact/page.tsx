import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="space-y-6 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
          Get in Touch
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed mx-auto">
          I'm here to help. Whether you have a question about my services or want to discuss your financial needs, I'm ready to answer your questions. Please feel free to get in touch with me directly.
        </p>
      </div>
      <div className="grid gap-12 lg:grid-cols-1 lg:gap-16 items-start">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Direct Contact</h2>
          <div className="mx-auto max-w-sm lg:max-w-md space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-muted rounded-md p-3 flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">My Office</h3>
                <p className="text-muted-foreground">Silverest, Chongwe, Lusaka Zmabia</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-muted rounded-md p-3 flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">mosesmwanakombo890@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-muted rounded-md p-3 flex-shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Call Me</h3>
                <p className="text-muted-foreground">+260 972 088 113</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}