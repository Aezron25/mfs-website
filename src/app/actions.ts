"use server";

import { z } from "zod";
import { Resend } from "resend";
import { ContactEmailTemplate } from "@/components/contact/ContactEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type ContactFormState = {
  message: string;
  status: "success" | "error";
} | {
  message: null;
  status: null;
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data. Please check your inputs.",
      status: "error",
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // You can use onbarding@resend.dev for testing
      to: 'mosesmwanakombo890@gmail.com',
      subject: `New message from ${name}`,
      reply_to: email,
      react: ContactEmailTemplate({ name, email, message }),
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        message: "Something went wrong. Please try again later.",
        status: "error",
      };
    }

    return {
      message: "Thank you for your message! We will get back to you shortly.",
      status: "success",
    };
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return {
      message: "Something went wrong. Please try again later.",
      status: "error",
    };
  }
}
