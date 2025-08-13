import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure environment variables are loaded
if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error('GOOGLE_GENAI_API_KEY environment variable is required');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    })
  ],
  model: 'googleai/gemini-2.0-flash',
});
