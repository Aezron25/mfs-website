import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Resend } from "resend";
import { z } from "zod";
import * as cors from "cors";

admin.initializeApp();

const corsMiddleware = cors({ origin: true });

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export const sendContactEmail = functions.https.onCall(async (data, context) => {
    const validatedFields = contactFormSchema.safeParse(data);

    if (!validatedFields.success) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a valid name, email, and message."
      );
    }
    
    const { name, email, message } = validatedFields.data;

    const resendApiKey = functions.config().resend.api_key;
    if (!resendApiKey) {
        throw new functions.https.HttpsError(
            "internal",
            "Resend API key is not configured."
        );
    }
    const resend = new Resend(resendApiKey);

    try {
        await resend.emails.send({
            from: "MFS Contact Form <onboarding@resend.dev>",
            to: "mosesmwanakombo890@gmail.com",
            subject: `New Message from ${name}`,
            reply_to: email,
            html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
        });

        return { success: true };

    } catch (error) {
        console.error("Error sending email:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Failed to send email."
        );
    }
});
