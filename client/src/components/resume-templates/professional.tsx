import React from 'react';
import { Resume } from '@shared/schema';
import { cn } from '@/lib/utils';

interface ProfessionalTemplateProps {
  resume: Resume;
  className?: string;
}

export function ProfessionalTemplate({ resume, className }: ProfessionalTemplateProps) {
  const { personalInfo, summary, workExperience, education, skills, customization } = resume;

  const fontStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}pt`,
    lineHeight: customization.lineSpacing,
  };

  const getAccentColor = () => {
    switch (customization.colorTheme) {
      case 'green': return '#10b981';
      case 'red': return '#ef4444';
      case 'gray': return '#6b7280';
      default: return '#3b82f6';
    }
  };

  const accentColor = getAccentColor();

  return (
    <div 
      className={cn("bg-white p-8 min-h-[11in] text-gray-900", className)}
      style={fontStyle}
      data-testid="resume-template-professional"
    >
      {/* Header */}
      <header className="pb-6 mb-6" style={{ borderBottom: `2px solid ${accentColor}` }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="text-gray-600 flex flex-wrap items-center gap-4">
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.email}</span>
          <span>{personalInfo.location}</span>
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} className="hover:underline" style={{ color: accentColor }}>
              {personalInfo.linkedin}
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} className="hover:underline" style={{ color: accentColor }}>
              {personalInfo.github}
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            Work Experience
          </h2>
          <div className="space-y-6">
            {workExperience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{job.position}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded">
                    {job.startDate} - {job.endDate || 'Present'}
                  </span>
                </div>
                {job.description && (
                  <p className="text-gray-700 mb-3">{job.description}</p>
                )}
                {job.achievements.length > 0 && (
                  <ul className="space-y-1">
                    {job.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: accentColor }}></span>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.field && <p className="text-gray-500 text-sm">{edu.field}</p>}
                  {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded">
                  {edu.graduationYear}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
            Technical Skills
          </h2>
          <div className="space-y-3">
            {skills.map((skillCategory) => (
              <div key={skillCategory.id} className="flex">
                <span className="font-medium w-24 flex-shrink-0" style={{ color: accentColor }}>
                  {skillCategory.category}:
                </span>
                <span className="text-gray-700">{skillCategory.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
