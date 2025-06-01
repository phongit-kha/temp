// src/ai/flows/suggest-tool-from-upload.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow that suggests suitable tools for rent based on an uploaded document describing a project.
 *
 * - suggestToolsFromUpload - An async function that takes document content as input and returns a list of suggested tools.
 * - SuggestToolsFromUploadInput - The input type for the suggestToolsFromUpload function, which is the document content.
 * - SuggestToolsFromUploadOutput - The output type for the suggestToolsFromUpload function, which is a list of tool suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestToolsFromUploadInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the uploaded document describing the project.'),
});
export type SuggestToolsFromUploadInput = z.infer<
  typeof SuggestToolsFromUploadInputSchema
>;

const SuggestToolsFromUploadOutputSchema = z.object({
  suggestedTools: z
    .array(z.string())
    .describe('A list of suggested tools for the project.'),
});
export type SuggestToolsFromUploadOutput = z.infer<
  typeof SuggestToolsFromUploadOutputSchema
>;

export async function suggestToolsFromUpload(
  input: SuggestToolsFromUploadInput
): Promise<SuggestToolsFromUploadOutput> {
  return suggestToolsFromUploadFlow(input);
}

const suggestToolsFromUploadPrompt = ai.definePrompt({
  name: 'suggestToolsFromUploadPrompt',
  input: {schema: SuggestToolsFromUploadInputSchema},
  output: {schema: SuggestToolsFromUploadOutputSchema},
  prompt: `You are an expert tool rental assistant. A user has uploaded a document describing their project. Based on the document, suggest the most suitable tools for the user to rent.

Document Content: {{{documentContent}}}

Suggest tools:
`,
});

const suggestToolsFromUploadFlow = ai.defineFlow(
  {
    name: 'suggestToolsFromUploadFlow',
    inputSchema: SuggestToolsFromUploadInputSchema,
    outputSchema: SuggestToolsFromUploadOutputSchema,
  },
  async input => {
    const {output} = await suggestToolsFromUploadPrompt(input);
    return output!;
  }
);
