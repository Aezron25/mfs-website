'use server';
import type { ContactFormValues } from './contact/page';
import { sendEmailFlow } from '@/ai/flows/send-email-flow';

export async function sendEmail(data: ContactFormValues) {
  try {
    const response = await sendEmailFlow(data);
    return { success: true, data: response };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Failed to send email.' };
  }
}
