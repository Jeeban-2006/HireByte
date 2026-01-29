import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

/* ---------- pdf2json ---------- */
async function extractWithPdf2Json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    let text = '';

    pdfParser.on('pdfParser_dataReady', (data: any) => {
      try {
        data?.Pages?.forEach((page: any) => {
          page.Texts?.forEach((t: any) => {
            t.R?.forEach((r: any) => {
              if (r.T) text += decodeURIComponent(r.T) + ' ';
            });
          });
          text += '\n';
        });
        resolve(text);
      } catch (e) {
        reject(e);
      }
    });

    pdfParser.on('pdfParser_dataError', reject);
    pdfParser.parseBuffer(buffer);
  });
}

/* ---------- pdf-parse ---------- */
async function extractWithPdfParse(buffer: Buffer): Promise<string> {
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text || '';
}

/* ---------- OCR (last resort) ---------- */
async function extractWithOCR(buffer: Buffer): Promise<string> {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng');
  const base64 = buffer.toString('base64');

  const {
    data: { text },
  } = await worker.recognize(`data:application/pdf;base64,${base64}`);

  await worker.terminate();
  return text || '';
}

/* ---------- POST ---------- */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const type = file.type;

    let text = '';
    let method = 'none';

    if (type === 'text/plain') {
      text = buffer.toString('utf8');
      method = 'plain-text';
    }

    if (type === 'application/pdf') {
      try {
        text = await withTimeout(extractWithPdf2Json(buffer), 4000);
        method = 'pdf2json';
      } catch {}

      if (text.replace(/\s+/g, '').length === 0) {
        try {
          text = await withTimeout(extractWithPdfParse(buffer), 6000);
          method = 'pdf-parse';
        } catch {}
      }

      if (
        text.replace(/\s+/g, '').length === 0 &&
        buffer.length < 3 * 1024 * 1024
      ) {
        try {
          text = await withTimeout(extractWithOCR(buffer), 15000);
          method = 'ocr';
        } catch {}
      }
    }

    // 🚨 IMPORTANT: NEVER reject here
    return NextResponse.json({
      success: true,
      extractionMethod: method,
      text, // even if empty
      textLength: text.replace(/\s+/g, '').length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Extraction failed' },
      { status: 500 }
    );
  }
}
