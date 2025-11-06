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
    
    // The email address to send to. Hardcoded for security.
    const toEmail = 'choolohezron@gmail.com';

    try {
      await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>', // Must be a verified domain on Resend
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
