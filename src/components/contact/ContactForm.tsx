"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { sendContactEmail } from "@/lib/firebase";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Send Message
    </Button>
  );
}

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
    }
    
    const validatedFields = contactFormSchema.safeParse(data);

    if (!validatedFields.success) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Invalid form data. Please check your inputs.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
        await sendContactEmail(validatedFields.data);
        toast({
            title: "Message Sent!",
            description: "Thank you for your message! We will get back to you shortly.",
        });
        formRef.current?.reset();
    } catch (error) {
        console.error("Firebase function error:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "Something went wrong. Please try again later.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your Name" required disabled={isSubmitting} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="your@email.com" required disabled={isSubmitting}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="How can we help you?" className="min-h-[120px]" required disabled={isSubmitting} />
      </div>
       <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Send Message
    </Button>
    </form>
  );
}
