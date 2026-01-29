/**
 * PDF Resume Parser using pdfjs-dist
 * 
 * This module uses pdfjs-dist to parse PDF resumes on the client-side.
 * 
 * Setup Instructions:
 * 1. Install pdfjs-dist: `npm install pdfjs-dist` (already installed)
 * 2. Worker Configuration:
 *    - The worker is loaded from CDN in this implementation
 *    - For local hosting, copy worker files to public directory:
 *      `cp node_modules/pdfjs-dist/build/pdf.worker.min.js public/`
 *    - Then update workerSrc to: `/pdf.worker.min.js`
 * 
 * Usage:
 * ```typescript
 * import { parseResumeFromPdf } from '@/lib/parsers/pdf-reader';
 * 
 * // From File object
 * const fileUrl = URL.createObjectURL(file);
 * const text = await parseResumeFromPdf(fileUrl);
 * URL.revokeObjectURL(fileUrl);
 * 
 * // Or use the helper
 * import { parseResumeFromPdfFile } from '@/lib/parsers/pdf-reader';
 * const text = await parseResumeFromPdfFile(file);
 * ```
 */

// Polyfill for DOMMatrix in Node.js environment
if (typeof window === 'undefined') {
  (global as any).DOMMatrix = class DOMMatrix {
    constructor() {
      // Minimal polyfill for server-side rendering
    }
  };
}

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

// Dynamically import pdfjs-dist only on client side
if (typeof window !== 'undefined') {
  pdfjsLib = require('pdfjs-dist');
  
  // Configure the worker for pdfjs-dist
  if (pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    // Alternative: Use CDN if local file is not available
    // pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
}

/**
 * Parse resume from PDF file URL
 * @param fileUrl - The URL created from URL.createObjectURL() or a remote PDF URL
 * @returns Promise<string> - Extracted text from the PDF
 */
export async function parseResumeFromPdf(fileUrl: string): Promise<string> {
  // Ensure we're running in browser environment
  if (typeof window === 'undefined' || !pdfjsLib) {
    throw new Error('PDF parsing is only available in browser environment');
  }

  try {
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items from the page
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error parsing PDF with pdfjs-dist:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse resume from PDF file (File object)
 * @param file - The PDF File object
 * @returns Promise<string> - Extracted text from the PDF
 */
export async function parseResumeFromPdfFile(file: File): Promise<string> {
  // Ensure we're running in browser environment
  if (typeof window === 'undefined') {
    throw new Error('PDF parsing is only available in browser environment');
  }
  
  // Create a temporary URL for the file
  const fileUrl = URL.createObjectURL(file);
  
  try {
    const text = await parseResumeFromPdf(fileUrl);
    return text;
  } finally {
    // Clean up the object URL
    URL.revokeObjectURL(fileUrl);
  }
}

// Alias for compatibility with resume-parser page
export const readPdf = parseResumeFromPdf;
