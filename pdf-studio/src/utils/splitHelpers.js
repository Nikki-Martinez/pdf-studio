import { PDFDocument } from 'pdf-lib';

// Extrae un rango específico de páginas (ej: "1-3, 5") a un solo PDF
export async function extractPdfPages(file, rangeString) {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = srcDoc.getPageCount();

  const pagesToExtract = parsePageRange(rangeString, totalPages);
  if (pagesToExtract.length === 0) {
    throw new Error('Rango de páginas no válido');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, pagesToExtract);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const pdfBytes = await newDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Separa cada página del PDF en un archivo independiente
export async function splitAllPdfPages(file) {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = srcDoc.getPageCount();
  const blobs = [];

  for (let i = 0; i < totalPages; i++) {
    const newDoc = await PDFDocument.create();
    const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
    newDoc.addPage(copiedPage);

    const pdfBytes = await newDoc.save();
    blobs.push({
      pageNumber: i + 1,
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
    });
  }

  return blobs;
}

// Convierte texto de rango "1-3, 5" a un arreglo de índices base cero [0, 1, 2, 4]
function parsePageRange(rangeStr, maxPages) {
  const indices = new Set();
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number);
      if (start && end && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= maxPages) indices.add(i - 1);
        }
      }
    } else {
      const page = Number(trimmed);
      if (page >= 1 && page <= maxPages) {
        indices.add(page - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}