"use server";

import { z } from "zod";

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

  try {
    // Here you would typically send an email.
    // For this example, we'll just log it and simulate success.
    console.log("New contact form submission:");
    console.log(validatedFields.data);

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
