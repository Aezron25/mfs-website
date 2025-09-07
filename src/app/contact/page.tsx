import { ContactForm } from "@/components/contact/ContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Get in Touch
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              We're here to help. Whether you have a question about our services or want to discuss your financial needs, our team is ready to answer your questions.
            </p>
          </div>
          <div className="space-y-4">
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
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-muted-foreground">mosesmwanakombo890@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-muted rounded-md p-3 flex-shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-muted-foreground">+260 972 088 113</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
