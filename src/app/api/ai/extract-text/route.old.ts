import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
// @ts-ignore - pdf-parse has type issues but works fine
import pdfParse from 'pdf-parse';

// Strategy 1: pdf2json (fast, works for most standard PDFs)
async function extractWithPdf2Json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      reject(new Error('pdf2json failed: ' + errData.parserError));
    });
    
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        let extractedText = '';
        
        if (pdfData?.Pages) {
          pdfData.Pages.forEach((page: any) => {
            if (page.Texts) {
              page.Texts.forEach((textItem: any) => {
                if (textItem.R) {
                  textItem.R.forEach((run: any) => {
                    if (run.T) {
                      extractedText += decodeURIComponent(run.T) + ' ';
                    }
                  });
                }
              });
              extractedText += '\n';
            }
          });
        }
        
        resolve(extractedText.trim());
      } catch (e) {
        reject(e);
      }
    });
    
    pdfParser.parseBuffer(buffer);
  });
}

// Strategy 2: pdf-parse (more robust, handles complex PDFs)
async function extractWithPdfParse(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (error) {
    throw new Error('pdf-parse failed: ' + error);
  }
}

// Strategy 3: OCR fallback for image-based PDFs using Tesseract.js
async function extractWithOCR(buffer: Buffer): Promise<string> {
  try {
    // Dynamically import to avoid SSR issues
    const { createWorker } = await import('tesseract.js');
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    // Set worker path for pdfjs
    if (typeof window === 'undefined') {
      GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    }
    
    const loadingTask = getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Initialize Tesseract worker
    const worker = await createWorker('eng');
    
    // Process each page
    for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) { // Limit to 10 pages for performance
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      
      // Create canvas
      const canvas = await import('canvas').then(m => m.createCanvas(viewport.width, viewport.height));
      const context = canvas.getContext('2d');
      
      // Render PDF page to canvas
      await page.render({
        canvasContext: context as any,
        viewport: viewport,
      }).promise;
      
      // Convert canvas to image and run OCR
      const imageData = canvas.toDataURL();
      const { data: { text } } = await worker.recognize(imageData);
      fullText += text + '\n';
    }
    
    await worker.terminate();
    return fullText.trim();
  } catch (error) {
    throw new Error('OCR extraction failed: ' + error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';
    let extractionMethod = 'unknown';

    let text = '';
    let extractionMethod = 'unknown';

    // Handle text files
    if (fileType === 'text/plain') {
      text = buffer.toString('utf-8');
      extractionMethod = 'plain-text';
    }
    // Handle PDF files with multi-strategy approach
    else if (fileType === 'application/pdf') {
      console.log('📄 Processing PDF file, size:', buffer.length);
      
      // Strategy 1: Try pdf2json first (fastest)
      try {
        console.log('🔄 Attempting extraction with pdf2json...');
        text = await extractWithPdf2Json(buffer);
        extractionMethod = 'pdf2json';
        console.log('✅ pdf2json succeeded, extracted', text.length, 'characters');
      } catch (error) {
        console.log('⚠️ pdf2json failed:', error);
      }
      
      // Strategy 2: If pdf2json fails or returns too little text, try pdf-parse
      if (!text || text.length < 50) {
        try {
          console.log('🔄 Attempting extraction with pdf-parse...');
          text = await extractWithPdfParse(buffer);
          extractionMethod = 'pdf-parse';
          console.log('✅ pdf-parse succeeded, extracted', text.length, 'characters');
        } catch (error) {
          console.log('⚠️ pdf-parse failed:', error);
        }
      }
      
      // Strategy 3: If both fail or text is still minimal, try OCR (for scanned/image PDFs)
      if (!text || text.length < 50) {
        try {
          console.log('🔄 Attempting OCR extraction (may take longer)...');
          text = await extractWithOCR(buffer);
          extractionMethod = 'ocr';
          console.log('✅ OCR succeeded, extracted', text.length, 'characters');
        } catch (error) {
          console.log('❌ OCR failed:', error);
          return NextResponse.json(
            { error: 'Could not extract text from PDF. All extraction methods failed. The PDF might be corrupted, encrypted, or completely image-based without readable text.' },
            { status: 400 }
          );
        }
      }
      
      if (!text || text.trim().length < 20) {
        return NextResponse.json(
          { error: 'Extracted text is too short or empty. Please ensure the PDF contains readable text content.' },
          { status: 400 }
        );
      }
    }
    // Handle other document types
    else if (fileType.includes('document') || fileType.includes('word')) {
      return NextResponse.json(
        { error: 'Word documents are not supported. Please convert to PDF or use the "Paste Text" option.' },
        { status: 400 }
      );
    }
    else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or text file.' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Could not extract enough text from file. Please use the "Paste Text" option.' },
        { status: 400 }
      );
    }

    console.log('✨ Final extraction:', extractionMethod, '- Text length:', text.length);
    return NextResponse.json({ 
      text: text.trim(),
      extractionMethod,
      textLength: text.trim().length
    });
  } catch (error) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from file. Please try the "Paste Text" option.' },
      { status: 500 }
    );
  }
}
