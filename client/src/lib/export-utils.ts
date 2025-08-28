import { Resume } from '@shared/schema';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export const exportToPDF = async (resumeElement: HTMLElement, filename = 'resume.pdf') => {
  // Using dynamic import to avoid SSR issues
  const html2pdf = (await import('html2pdf.js')).default;
  
  const options = {
    margin: 0.5,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  try {
    await html2pdf().from(resumeElement).set(options).save();
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
};

export const exportToDOCX = async (resume: Resume, filename = 'resume.docx') => {
  try {
    const { personalInfo, summary, workExperience, education, skills } = resume;
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: `${personalInfo.firstName} ${personalInfo.lastName}`,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun(`${personalInfo.email} | ${personalInfo.phone}`),
              personalInfo.location ? new TextRun(` | ${personalInfo.location}`) : new TextRun(''),
              personalInfo.linkedin ? new TextRun(` | ${personalInfo.linkedin}`) : new TextRun(''),
            ],
            spacing: { after: 400 },
          }),

          // Summary
          ...(summary ? [
            new Paragraph({
              text: "Professional Summary",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: summary,
              spacing: { after: 400 },
            }),
          ] : []),

          // Work Experience
          new Paragraph({
            text: "Work Experience",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          ...workExperience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true }),
                new TextRun(` - ${exp.company}`),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `${exp.startDate} - ${exp.endDate || 'Present'}`,
              spacing: { after: 200 },
            }),
            ...(exp.description ? [new Paragraph({ text: exp.description, spacing: { after: 200 } })] : []),
            ...exp.achievements.map(achievement => 
              new Paragraph({
                text: `• ${achievement}`,
                spacing: { after: 100 },
              })
            ),
          ]),

          // Education
          new Paragraph({
            text: "Education",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          ...education.map(edu => 
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true }),
                new TextRun(` - ${edu.institution} (${edu.graduationYear})`),
              ],
              spacing: { after: 200 },
            })
          ),

          // Skills
          new Paragraph({
            text: "Skills",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          ...skills.map(skillCategory =>
            new Paragraph({
              children: [
                new TextRun({ text: `${skillCategory.category}: `, bold: true }),
                new TextRun(skillCategory.skills.join(', ')),
              ],
              spacing: { after: 100 },
            })
          ),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting DOCX:', error);
    throw new Error('Failed to export DOCX. Please try again.');
  }
};

export const generateShareableLink = (resumeId: string): string => {
  // For now, simulate a shareable link - in production, this would create a real shareable URL
  const baseUrl = window.location.origin;
  return `${baseUrl}/resume/${resumeId}`;
};
