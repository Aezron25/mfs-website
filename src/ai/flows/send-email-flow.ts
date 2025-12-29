'use server';
/**
 * @fileOverview A flow for sending a contact form email.
 *
 * - sendEmailFlow - The main flow function.
 * - SendEmailFlowInput - The input type for the flow.
 * - SendEmailFlowOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

const SendEmailFlowInputSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  email: z.string().email().describe('The email address of the sender.'),
  subject: z.string().describe('The subject of the message.'),
  message: z.string().describe('The content of the message.'),
});
export type SendEmailFlowInput = z.infer<typeof SendEmailFlowInputSchema>;

const SendEmailFlowOutputSchema = z.object({
  success: z.boolean(),
});
export type SendEmailFlowOutput = z.infer<typeof SendEmailFlowOutputSchema>;

export const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: SendEmailFlowInputSchema,
    outputSchema: SendEmailFlowOutputSchema,
  },
  async (input) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, subject, message } = input;
    
    // The email address to send to, loaded from environment variables.
    const toEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

    if (!toEmail) {
      console.error('Recipient email address is not configured. Set NEXT_PUBLIC_CONTACT_EMAIL in your environment variables.');
      throw new Error('Server configuration error: Recipient email is missing.');
    }

    try {
      await resend.emails.send({
        from: 'Mwanakombo Financial Services <noreply@yourdomain.com>', // IMPORTANT: Replace with your verified domain on Resend
        to: toEmail,
        subject: `New Message from ${name}: ${subject}`,
        reply_to: email,
        html: `<p>You have received a new message from your website contact form.</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`,
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email via Resend.');
    }
  }
);
