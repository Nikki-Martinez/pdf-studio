import { PDFDocument } from 'pdf-lib';

export async function convertImagesToPdf(imageFiles, orientation = 'portrait') {
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const arrayBuffer = await file.arrayBuffer();
    let image;

    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      continue;
    }

    const { width, height } = image;
    
    // Determinar dimensiones según orientación
    let pageWidth = width;
    let pageHeight = height;

    if (orientation === 'landscape' && height > width) {
      pageWidth = height;
      pageHeight = width;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    
    // Centrar la imagen en la página
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;

    page.drawImage(image, {
      x,
      y,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}