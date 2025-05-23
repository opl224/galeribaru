// 'use server';

/**
 * @fileOverview AI flow to analyze photos, tag them, and extract relevant keywords, also suggesting the date taken.
 *
 * - analyzePhoto - A function that handles the photo analysis process.
 * - AnalyzePhotoInput - The input type for the analyzePhoto function.
 * - AnalyzePhotoOutput - The return type for the analyzePhoto function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AnalyzePhotoInput = z.infer<typeof AnalyzePhotoInputSchema>;

const AnalyzePhotoOutputSchema = z.object({
  tags: z.array(z.string()).describe('Keywords that describe the image.'),
  suggestedDateTaken: z.string().optional().describe('Suggested date the photo was taken in ISO format (YYYY-MM-DD).'),
});

export type AnalyzePhotoOutput = z.infer<typeof AnalyzePhotoOutputSchema>;

export async function analyzePhoto(input: AnalyzePhotoInput): Promise<AnalyzePhotoOutput> {
  return analyzePhotoFlow(input);
}

const analyzePhotoPrompt = ai.definePrompt({
  name: 'analyzePhotoPrompt',
  input: {schema: AnalyzePhotoInputSchema},
  output: {schema: AnalyzePhotoOutputSchema},
  prompt: `You are an expert in image analysis. Analyze the image provided and extract keywords and suggest a date taken.

  Return a list of keywords that describe the image.
  If possible, suggest a date that the picture was taken.  If you are unable to determine the date, leave the suggestedDateTaken field blank.

  Image: {{media url=photoDataUri}}
  `,
});

const analyzePhotoFlow = ai.defineFlow(
  {
    name: 'analyzePhotoFlow',
    inputSchema: AnalyzePhotoInputSchema,
    outputSchema: AnalyzePhotoOutputSchema,
  },
  async input => {
    const {output} = await analyzePhotoPrompt(input);
    return output!;
  }
);
