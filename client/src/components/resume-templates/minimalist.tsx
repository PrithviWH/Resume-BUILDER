import React from 'react';
import { Resume } from '@shared/schema';
import { cn } from '@/lib/utils';

interface MinimalistTemplateProps {
  resume: Resume;
  className?: string;
}

export function MinimalistTemplate({ resume, className }: MinimalistTemplateProps) {
  const { personalInfo, summary, workExperience, education, skills, customization } = resume;

  const fontStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}pt`,
    lineHeight: customization.lineSpacing,
  };

  return (
    <div 
      className={cn("bg-white p-8 min-h-[11in] text-gray-900", className)}
      style={fontStyle}
      data-testid="resume-template-minimalist"
    >
      {/* Header */}
      <header className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="text-gray-600 space-y-1">
          <div>{personalInfo.email} • {personalInfo.phone}</div>
          <div>{personalInfo.location}</div>
          {(personalInfo.linkedin || personalInfo.github) && (
            <div className="flex space-x-4">
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} className="text-gray-600 hover:text-gray-900">
                  {personalInfo.linkedin}
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} className="text-gray-600 hover:text-gray-900">
                  {personalInfo.github}
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
          <div className="space-y-4">
            {workExperience.map((job) => (
              <div key={job.id} className="border-l-2 border-gray-100 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{job.position}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {job.startDate} - {job.endDate || 'Present'}
                  </span>
                </div>
                {job.description && (
                  <p className="text-gray-700 mb-2">{job.description}</p>
                )}
                {job.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {job.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
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
          <h2 className="text-lg font-semibold mb-4">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.field && <p className="text-gray-500 text-sm">{edu.field}</p>}
                </div>
                <span className="text-gray-500 text-sm">{edu.graduationYear}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <div className="space-y-2">
            {skills.map((skillCategory) => (
              <div key={skillCategory.id}>
                <span className="font-medium">{skillCategory.category}:</span>
                <span className="ml-2 text-gray-700">{skillCategory.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
