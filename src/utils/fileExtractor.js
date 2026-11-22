import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker for PDF.js
try {
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker init:', e);
}

/**
 * Извлекает полный читаемый текст из файлов PDF, DOCX, TXT, MD, CSV.
 * Позволяет GigaChat получать полное содержимое отчетов, презентаций и уставов НКО.
 */
export async function extractTextFromFile(file) {
  if (!file) return '';
  const name = (file.name || '').toLowerCase();

  // 1. Текстовые файлы
  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv') || name.endsWith('.json')) {
    try {
      return await file.text();
    } catch (e) {
      return '';
    }
  }

  // 2. Документы Microsoft Word (.docx)
  if (name.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return (result.value || '').trim();
    } catch (e) {
      console.warn('Ошибка извлечения текста из DOCX:', e);
      return '';
    }
  }

  // 3. Документы и презентации PDF (.pdf)
  if (name.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      const maxPages = Math.min(pdf.numPages, 40);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        if (pageText.trim()) {
          fullText += `[Стр. ${i}]: ${pageText.trim()}\n\n`;
        }
      }
      return fullText.trim();
    } catch (e) {
      console.warn('Ошибка извлечения текста из PDF:', e);
      return '';
    }
  }

  // 4. Попытка прочитать как текст
  try {
    return await file.text();
  } catch (e) {
    return '';
  }
}
