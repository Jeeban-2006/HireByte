export function validateResumeText(text: string): { isValid: boolean; error?: string } {
  if (!text || text.trim().length < 20) {
    return {
      isValid: false,
      error: 'Please provide some resume content to analyze.'
    };
  }
  
  if (text.length > 20000) {
    return {
      isValid: false,
      error: 'Resume text is too long. Please keep it under 20,000 characters.'
    };
  }
  
  return { isValid: true };
}