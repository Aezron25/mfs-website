// This is a server-side file.
'use server';

/**
 * @fileOverview AI-powered service recommendation flow for Mwanakombo.
 *
 * This file exports:
 * - `recommendService`: An async function that takes a user inquiry and returns a service recommendation.
 * - `AIServiceRecommendationInput`: The input type for the `recommendService` function.
 * - `AIServiceRecommendationOutput`: The output type for the `recommendService` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema for the AI service recommendation.
const AIServiceRecommendationInputSchema = z.object({
  inquiry: z
    .string()
    .describe(
      'The financial inquiry from the user. This should be a detailed description of their needs.'
    ),
});
export type AIServiceRecommendationInput = z.infer<
  typeof AIServiceRecommendationInputSchema
>;

// Define the output schema for the AI service recommendation.
const AIServiceRecommendationOutputSchema = z.object({
  recommendedService: z
    .string()
    .describe(
      'The service recommended by the AI. Options are: audit services, tax services, consultancy services, and personal finance.'
    ),
  reason: z
    .string()
    .describe(
      'The detailed reason for recommending the service based on the user inquiry.'
    ),
});
export type AIServiceRecommendationOutput = z.infer<
  typeof AIServiceRecommendationOutputSchema
>;

// Exported function to recommend a service based on user inquiry.
export async function recommendService(
  input: AIServiceRecommendationInput
): Promise<AIServiceRecommendationOutput> {
  return aiServiceRecommendationFlow(input);
}

// Define the prompt for the AI service recommendation.
const aiServiceRecommendationPrompt = ai.definePrompt({
  name: 'aiServiceRecommendationPrompt',
  input: { schema: AIServiceRecommendationInputSchema },
  output: { schema: AIServiceRecommendationOutputSchema },
  prompt: `You are an AI assistant for Mwanakombo, a financial expert. You are designed to recommend the most suitable financial service he provides based on user inquiries.

You must select one of the following services:
- audit services
- tax services
- consultancy services
- personal finance

Analyze the following inquiry and determine which service is most appropriate. Provide a clear and concise reason for your recommendation.

Inquiry: {{{inquiry}}}

Ensure your response is well-structured and includes both the recommended service and the reason for the recommendation.
`,
});

// Define the Genkit flow for the AI service recommendation.
const aiServiceRecommendationFlow = ai.defineFlow(
  {
    name: 'aiServiceRecommendationFlow',
    inputSchema: AIServiceRecommendationInputSchema,
    outputSchema: AIServiceRecommendationOutputSchema,
  },
  async input => {
    const { output } = await aiServiceRecommendationPrompt(input);
    return output!;
  }
);
