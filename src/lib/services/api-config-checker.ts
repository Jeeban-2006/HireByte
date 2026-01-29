/**
 * API Configuration Utilities
 * Helper functions to check API configuration status
 */

export interface ApiConfigStatus {
  groqAI: boolean;
  allConfigured: boolean;
  missingConfigs: string[];
}

/**
 * Check if all required API configurations are present
 */
export function checkApiConfig(): ApiConfigStatus {
  const groqAI = !!process.env.GROQ_API_KEY;

  const missingConfigs: string[] = [];
  
  if (!groqAI) {
    missingConfigs.push('Groq API Key (GROQ_API_KEY)');
  }

  return {
    groqAI,
    allConfigured: groqAI,
    missingConfigs,
  };
}

/**
 * Get user-friendly error message for missing API configuration
 */
export function getApiConfigErrorMessage(): string | null {
  if (!process.env.GROQ_API_KEY) {
    return "Missing Groq API key. Please add GROQ_API_KEY to your .env.local file.";
  }

  return null;
}
