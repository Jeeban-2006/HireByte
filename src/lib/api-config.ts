/**
 * API Configuration Utilities
 * Helper functions to check API configuration status
 */

export interface ApiConfigStatus {
  googleAI: boolean;
  firebase: boolean;
  allConfigured: boolean;
  missingConfigs: string[];
}

/**
 * Check if all required API configurations are present
 */
export function checkApiConfig(): ApiConfigStatus {
  const googleAI = !!process.env.GOOGLE_GENAI_API_KEY;
  const firebase = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  );

  const missingConfigs: string[] = [];
  
  if (!googleAI) {
    missingConfigs.push('Google AI API Key (GOOGLE_GENAI_API_KEY)');
  }
  
  if (!firebase) {
    missingConfigs.push('Firebase Configuration');
  }

  return {
    googleAI,
    firebase,
    allConfigured: googleAI && firebase,
    missingConfigs,
  };
}

/**
 * Get user-friendly error message for missing API configuration
 */
export function getApiConfigErrorMessage(): string | null {
  const status = checkApiConfig();
  
  if (status.allConfigured) {
    return null;
  }

  const missing = status.missingConfigs.join(', ');
  return `Missing API configuration: ${missing}. Please check the API_SETUP.md file for setup instructions.`;
}
