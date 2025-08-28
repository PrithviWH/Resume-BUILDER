import { PDFDocument, rgb } from 'pdf-lib';
import { Resume } from '@shared/schema';

export const parsePDFText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Basic PDF text extraction - in a real app, you'd use a more sophisticated parser
    let text = '';
    for (const page of pages) {
      // This is a simplified extraction - pdf-lib doesn't have built-in text extraction
      // In a production app, you'd use libraries like pdf2pic with OCR or pdfjs-dist
      const { width, height } = page.getSize();
      text += `Page ${pages.indexOf(page) + 1} content (${width}x${height})\n`;
    }
    
    return text || 'PDF content could not be extracted. Please enter your information manually.';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF. Please try a different file or enter your information manually.');
  }
};

export const extractResumeData = async (pdfText: string): Promise<Partial<Resume>> => {
  // This is a simplified extraction - in a real app, you'd use AI/NLP for better parsing
  const lines = pdfText.split('\n').filter(line => line.trim());
  
  // Basic extraction patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
  
  const extractedData: Partial<Resume> = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
  };

  // Extract email
  const emailMatch = pdfText.match(emailPattern);
  if (emailMatch && extractedData.personalInfo) {
    extractedData.personalInfo.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = pdfText.match(phonePattern);
  if (phoneMatch && extractedData.personalInfo) {
    extractedData.personalInfo.phone = phoneMatch[0];
  }

  // Try to extract name from first few lines
  if (lines.length > 0 && extractedData.personalInfo) {
    const firstLine = lines[0].trim();
    const nameParts = firstLine.split(' ');
    if (nameParts.length >= 2) {
      extractedData.personalInfo.firstName = nameParts[0];
      extractedData.personalInfo.lastName = nameParts.slice(1).join(' ');
    }
  }

  return extractedData;
};
