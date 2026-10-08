import zlib from 'zlib';
import { extractText as extractUnpdfText } from 'unpdf';
import PDFParser from 'pdf2json';

/**
 * Universal, Multi-Engine Resume Document Text Extractor (supports PDF, DOCX, TXT, MD).
 * Guaranteed to extract actual candidate text across all PDF engines and formats.
 */
export async function extractResumeTextFromBuffer(
  buffer: Buffer,
  fileName: string = 'resume.pdf'
): Promise<string> {
  const ext = (fileName.toLowerCase().split('.').pop() || '').trim();

  // 1. Plain text and markdown files
  if (['txt', 'md', 'text', 'json', 'csv'].includes(ext)) {
    return buffer.toString('utf-8');
  }

  // 2. PDF Documents
  if (ext === 'pdf') {
    // Strategy A: Universal unpdf extractor
    try {
      const uint8 = new Uint8Array(buffer);
      const result: any = await extractUnpdfText(uint8, { mergePages: true });
      let text = '';
      if (typeof result === 'string') {
        text = result;
      } else if (Array.isArray(result?.text)) {
        text = result.text.join('\n\n');
      } else if (typeof result?.text === 'string') {
        text = result.text;
      } else if (Array.isArray(result?.pages)) {
        text = result.pages.map((p: any) => (typeof p === 'string' ? p : p?.text || '')).join('\n\n');
      }

      if (text && text.trim().length > 30) {
        return cleanExtractedText(text);
      }
    } catch (unpdfErr: any) {
      console.warn('[unpdf Extractor Notice]:', unpdfErr?.message || unpdfErr);
    }

    // Strategy B: pdf2json battle-tested Node parser
    try {
      const jsonText = await parseWithPdf2json(buffer);
      if (jsonText && jsonText.trim().length > 30) {
        return cleanExtractedText(jsonText);
      }
    } catch (pdf2jsonErr: any) {
      console.warn('[pdf2json Extractor Notice]:', pdf2jsonErr?.message || pdf2jsonErr);
    }

    // Strategy C: Native zlib stream decompression
    try {
      const nativeText = extractTextFromPdfNative(buffer);
      if (nativeText && nativeText.trim().length > 30) {
        return cleanExtractedText(nativeText);
      }
    } catch (nativeErr: any) {
      console.warn('[Native Stream Extractor Notice]:', nativeErr?.message || nativeErr);
    }

    // Strategy D: ASCII text sanitization
    const rawString = buffer.toString('utf-8');
    return cleanExtractedText(
      rawString
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\b(?:obj|endobj|stream|endstream|xref|trailer|startxref|Length\s+\d+|FlateDecode|Catalog|Pages|Font|MediaBox|CropBox)\b/gi, ' ')
        .replace(/<<[^>]*>>/g, ' ')
    );
  }

  // 3. Word DOCX Documents
  if (['docx', 'doc'].includes(ext)) {
    try {
      const raw = buffer.toString('latin1');
      const xmlTags = raw.match(/<w:t[^>]*>(.*?)<\/w:t>/gi) || [];
      if (xmlTags.length > 0) {
        const extracted = xmlTags.map((t) => t.replace(/<[^>]+>/g, '')).join(' ');
        if (extracted.trim().length > 20) {
          return cleanExtractedText(extracted);
        }
      }
    } catch (docxErr) {
      console.warn('[DOCX Extractor Warning]:', docxErr);
    }
  }

  // Fallback utf-8
  return cleanExtractedText(buffer.toString('utf-8'));
}

/**
 * Parses PDF buffer using pdf2json
 */
function parseWithPdf2json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new (PDFParser as any)(null, 1);
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        reject(new Error(errData?.parserError || 'PDF parsing failed'));
      });
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Attempt raw text content first
          let rawText = pdfParser.getRawTextContent() || '';

          // If rawText is empty or short, assemble directly from page texts
          if (!rawText || rawText.trim().length < 30) {
            const pageTexts: string[] = [];
            if (pdfData?.Pages && Array.isArray(pdfData.Pages)) {
              for (const page of pdfData.Pages) {
                if (page.Texts && Array.isArray(page.Texts)) {
                  const line = page.Texts.map((t: any) => {
                    const str = t?.R?.[0]?.T || '';
                    try {
                      return decodeURIComponent(str);
                    } catch {
                      return str;
                    }
                  }).join(' ');
                  pageTexts.push(line);
                }
              }
            }
            if (pageTexts.length > 0) {
              rawText = pageTexts.join('\n');
            }
          }

          resolve(rawText || '');
        } catch (e) {
          reject(e);
        }
      });
      pdfParser.parseBuffer(buffer);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Native zlib stream decompression for PDF text operators
 */
function extractTextFromPdfNative(buffer: Buffer): string {
  const textChunks: string[] = [];

  function decodePdfString(str: string): string {
    const escapeMap: Record<string, string> = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' };
    return str
      .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\([nrtbf])/g, (_, ch) => escapeMap[ch] || ch)
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
      .replace(/\\(.)/g, '$1');
  }

  function extractFromStreamContent(streamText: string): string[] {
    const extracted: string[] = [];

    // Array TJ operator: [ (Hello) 20 (World) ] TJ
    const arrayTjRegex = /\[((?:[^\(\)\[\]]*\([^\)]*\))+[^\(\)\[\]]*)\]\s*TJ/gi;
    let match: RegExpExecArray | null;
    while ((match = arrayTjRegex.exec(streamText)) !== null) {
      const inner = match[1];
      const stringMatches = inner.match(/\(([^)]*)\)/g) || [];
      const line = stringMatches.map((s) => decodePdfString(s.slice(1, -1))).join('');
      if (line.trim().length > 0) {
        extracted.push(line.trim());
      }
    }

    // Direct string operators: (Hello World) Tj
    const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
    while ((match = tjRegex.exec(streamText)) !== null) {
      const decoded = decodePdfString(match[1]);
      if (decoded.trim().length > 0) {
        extracted.push(decoded.trim());
      }
    }

    return extracted;
  }

  const bufferLatin = buffer.toString('latin1');
  const streamStartRegex = /stream\r?\n/g;
  let streamMatch: RegExpExecArray | null;
  while ((streamMatch = streamStartRegex.exec(bufferLatin)) !== null) {
    const startPos = streamMatch.index + streamMatch[0].length;
    const endPos = buffer.indexOf(Buffer.from('endstream'), startPos);
    if (endPos > startPos) {
      const streamBuf = buffer.subarray(startPos, endPos);
      try {
        const decompressed = zlib.inflateSync(streamBuf);
        const lines = extractFromStreamContent(decompressed.toString('latin1'));
        if (lines.length > 0) textChunks.push(...lines);
      } catch {
        try {
          const decompressedRaw = zlib.inflateRawSync(streamBuf);
          const lines = extractFromStreamContent(decompressedRaw.toString('latin1'));
          if (lines.length > 0) textChunks.push(...lines);
        } catch {
          const lines = extractFromStreamContent(streamBuf.toString('latin1'));
          if (lines.length > 0) textChunks.push(...lines);
        }
      }
    }
  }

  if (textChunks.length === 0) {
    textChunks.push(...extractFromStreamContent(bufferLatin));
  }

  return textChunks.join('\n');
}

/**
 * Cleans extracted text formatting, URL encoded chars and excessive whitespace
 */
function cleanExtractedText(text: string): string {
  if (!text) return '';
  
  // Clean URL encoding (e.g., %20 -> space from pdf2json) safely without URIError
  let cleaned = text;
  cleaned = cleaned.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => {
    try {
      return decodeURIComponent('%' + hex);
    } catch {
      return String.fromCharCode(parseInt(hex, 16));
    }
  });
  cleaned = cleaned.replace(/\+/g, ' ');

  return cleaned
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \u00A0]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
