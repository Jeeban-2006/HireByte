
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes and trims text to a specified maximum length.
 * - Removes curly quotes and other special characters.
 * - Replaces multiple newlines with a single newline.
 * - Trims leading/trailing whitespace.
 * - Trims the text to a maximum character length.
 * @param text The input string.
 * @param maxLength The maximum allowed length of the string.
 * @returns The sanitized and trimmed string.
 */
export function sanitizeAndTrim(text: string, maxLength: number): string {
  if (!text) {
    return "";
  }
  
  let sanitized = text
    // Replace curly single quotes
    .replace(/[\u2018\u2019]/g, "'")
    // Replace curly double quotes
    .replace(/[\u201C\u201D]/g, '"')
    // Replace en-dashes and em-dashes
    .replace(/[\u2013\u2014]/g, '-')
    // Remove other non-standard characters (optional, can be expanded)
    .replace(/[^\x00-\x7F]/g, "")
    // Normalize line breaks and remove excessive newlines
    .replace(/\r\n/g, '\n')
    .replace(/(\n\s*){3,}/g, '\n\n')
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}
