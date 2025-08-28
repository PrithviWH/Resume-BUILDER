import * as pdfjsLib from 'pdfjs-dist';
import { Resume } from '@shared/schema';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parsePDFText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      fullText += pageText + '\n';
    }
    
    return fullText.trim() || 'PDF content could not be extracted. Please enter your information manually.';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF. Please try a different file or enter your information manually.');
  }
};

export const extractResumeData = async (pdfText: string): Promise<Partial<Resume>> => {
  const lines = pdfText.split('\n').filter(line => line.trim());
  const text = pdfText.toLowerCase();
  
  // Enhanced extraction patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phonePattern = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
  const urlPattern = /(https?:\/\/|www\.)[^\s]+|linkedin\.com\/in\/[^\s]+|github\.com\/[^\s]+/gi;
  
  const extractedData: Partial<Resume> = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
  };

  // Extract contact information
  const emailMatches = pdfText.match(emailPattern);
  if (emailMatches && extractedData.personalInfo) {
    extractedData.personalInfo.email = emailMatches[0];
  }

  const phoneMatches = pdfText.match(phonePattern);
  if (phoneMatches && extractedData.personalInfo) {
    extractedData.personalInfo.phone = phoneMatches[0].replace(/\s+/g, ' ').trim();
  }

  // Extract URLs (LinkedIn, GitHub)
  const urlMatches = pdfText.match(urlPattern);
  if (urlMatches && extractedData.personalInfo) {
    urlMatches.forEach(url => {
      if (url.toLowerCase().includes('linkedin')) {
        extractedData.personalInfo!.linkedin = url;
      } else if (url.toLowerCase().includes('github')) {
        extractedData.personalInfo!.github = url;
      }
    });
  }

  // Extract name - look for the first line that looks like a name
  if (lines.length > 0 && extractedData.personalInfo) {
    for (const line of lines.slice(0, 5)) {
      const cleanLine = line.trim();
      // Skip lines that look like contact info
      if (cleanLine.includes('@') || cleanLine.match(/\d{3}/) || cleanLine.toLowerCase().includes('http')) {
        continue;
      }
      
      const nameParts = cleanLine.split(' ').filter(part => 
        part.length > 1 && 
        /^[A-Za-z]+$/.test(part) && 
        !['resume', 'cv', 'curriculum', 'vitae'].includes(part.toLowerCase())
      );
      
      if (nameParts.length >= 2 && nameParts.length <= 5) {
        extractedData.personalInfo.firstName = nameParts[0];
        extractedData.personalInfo.lastName = nameParts.slice(1).join(' ');
        break;
      }
    }
  }

  // Extract work experience
  const workSections = extractSection(text, ['experience', 'work history', 'employment', 'professional experience']);
  if (workSections.length > 0) {
    extractedData.workExperience = parseWorkExperience(workSections[0]);
  }

  // Extract education
  const educationSections = extractSection(text, ['education', 'academic background', 'qualifications']);
  if (educationSections.length > 0) {
    extractedData.education = parseEducation(educationSections[0]);
  }

  // Extract skills
  const skillsSections = extractSection(text, ['skills', 'technical skills', 'competencies', 'technologies']);
  if (skillsSections.length > 0) {
    extractedData.skills = parseSkills(skillsSections[0]);
  }

  // Extract summary/objective
  const summarySections = extractSection(text, ['summary', 'objective', 'profile', 'about']);
  if (summarySections.length > 0) {
    extractedData.summary = summarySections[0].replace(/\s+/g, ' ').trim();
  }

  return extractedData;
};

// Helper functions for parsing different sections
function extractSection(text: string, keywords: string[]): string[] {
  const sections: string[] = [];
  
  for (const keyword of keywords) {
    const pattern = new RegExp(`\\b${keyword}\\b[:\\s]*([\\s\\S]*?)(?=\\b(?:experience|education|skills|summary|objective|profile|certifications|projects|awards)\\b|$)`, 'i');
    const match = text.match(pattern);
    if (match && match[1]) {
      sections.push(match[1].trim());
    }
  }
  
  return sections;
}

function parseWorkExperience(text: string): any[] {
  const experiences: any[] = [];
  
  // Look for patterns like "Company Name" followed by "Job Title" and dates
  const experiencePattern = /([A-Za-z\s&.,]+)\s*[-–]\s*([A-Za-z\s]+)\s*\(?((?:19|20)\d{2})\s*[-–]?\s*((?:19|20)\d{2}|present|current)?\)?/gi;
  const matches = text.match(experiencePattern);
  
  if (matches) {
    matches.forEach((match, index) => {
      const parts = match.split(/[-–]/);
      if (parts.length >= 2) {
        experiences.push({
          id: `exp-${index}`,
          company: parts[0].trim(),
          position: parts[1].trim(),
          startDate: extractYear(match) || '',
          endDate: extractEndYear(match) || '',
          isCurrent: /present|current/i.test(match),
          description: '',
          achievements: []
        });
      }
    });
  }
  
  return experiences.slice(0, 5); // Limit to 5 experiences
}

function parseEducation(text: string): any[] {
  const education: any[] = [];
  
  // Look for degree and institution patterns
  const degreePattern = /(bachelor|master|phd|doctorate|diploma|certificate|degree|b\.?a\.?|b\.?s\.?|m\.?a\.?|m\.?s\.?|ph\.?d\.?)[^,\n]*(?:,|\s+at\s+|\s+from\s+|\s+-\s+)([^,\n]+)/gi;
  const matches = text.match(degreePattern);
  
  if (matches) {
    matches.forEach((match, index) => {
      const parts = match.split(/,|\s+at\s+|\s+from\s+|\s+-\s+/);
      if (parts.length >= 2) {
        education.push({
          id: `edu-${index}`,
          degree: parts[0].trim(),
          institution: parts[1].trim(),
          field: '',
          graduationYear: extractYear(match) || '',
          gpa: ''
        });
      }
    });
  }
  
  return education.slice(0, 3); // Limit to 3 education entries
}

function parseSkills(text: string): any[] {
  const skills: any[] = [];
  
  // Extract skills - look for comma-separated lists
  const skillPatterns = [
    /(?:programming languages?|languages?)[:\s]*([^.]+)/i,
    /(?:frameworks?|technologies?)[:\s]*([^.]+)/i,
    /(?:tools?|software)[:\s]*([^.]+)/i,
    /(?:skills?)[:\s]*([^.]+)/i
  ];
  
  skillPatterns.forEach((pattern, index) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      const skillList = match[1]
        .split(/[,;]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0 && skill.length < 30);
      
      if (skillList.length > 0) {
        skills.push({
          id: `skill-${index}`,
          category: getCategoryName(pattern.source),
          skills: skillList.slice(0, 10) // Limit to 10 skills per category
        });
      }
    }
  });
  
  return skills;
}

function getCategoryName(patternSource: string): string {
  if (patternSource.includes('programming')) return 'Programming Languages';
  if (patternSource.includes('frameworks')) return 'Frameworks & Technologies';
  if (patternSource.includes('tools')) return 'Tools & Software';
  return 'Technical Skills';
}

function extractYear(text: string): string | null {
  const yearMatch = text.match(/(19|20)\d{2}/);
  return yearMatch ? yearMatch[0] : null;
}

function extractEndYear(text: string): string | null {
  if (/present|current/i.test(text)) return '';
  const years = text.match(/(19|20)\d{2}/g);
  return years && years.length > 1 ? years[1] : null;
}
