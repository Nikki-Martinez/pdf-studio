import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// Genera la lista de páginas con sus miniaturas en formato DataURL
export async function loadPdfPagesForOrganize(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
  const totalPages = pdf.numPages;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.4 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    pages.push({
      id: `page-${i}-${Math.random().toString(36).substring(2, 9)}`,
      originalIndex: i - 1,
      thumbnail: canvas.toDataURL('image/jpeg', 0.8),
    });
  }

  return pages;
}

// Reconstruye el documento aplicando el nuevo orden de índices
export async function rebuildPdfDocument(originalFile, pageOrder) {
  const arrayBuffer = await originalFile.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const newDoc = await PDFDocument.create();

  const pageIndicesToCopy = pageOrder.map((p) => p.originalIndex);
  const copiedPages = await newDoc.copyPages(srcDoc, pageIndicesToCopy);

  copiedPages.forEach((page) => newDoc.addPage(page));

  const pdfBytes = await newDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}