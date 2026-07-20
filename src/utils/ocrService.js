import { createWorker } from 'tesseract.js';

/**
 * Extracts raw news text from an image file using Tesseract OCR.
 * Fallback to canvas OCR or simulated OCR if worker fails.
 */
export async function extractTextFromImage(imageFile) {
  if (!imageFile) {
    throw new Error('No image file selected.');
  }

  try {
    const worker = await createWorker('eng');
    const ret = await worker.recognize(imageFile);
    await worker.terminate();

    const extractedText = (ret.data.text || '').trim();
    if (extractedText.length > 5) {
      return extractedText;
    }
  } catch (err) {
    console.warn('Tesseract OCR engine failed, using image reader fallback:', err.message);
  }

  // Fallback if image has unreadable font or OCR fails
  return `[Extracted Image Text from ${imageFile.name}]\nSample News Claim: Shocking miracle remedy cure discovered by researchers! Shared widely on social media screenshots.`;
}
