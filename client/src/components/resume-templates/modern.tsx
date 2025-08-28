import React from 'react';
import { Resume } from '@shared/schema';
import { cn } from '@/lib/utils';

interface ModernTemplateProps {
  resume: Resume;
  className?: string;
}

export function ModernTemplate({ resume, className }: ModernTemplateProps) {
  const { personalInfo, summary, workExperience, education, skills, customization } = resume;

  const fontStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}pt`,
    lineHeight: customization.lineSpacing,
  };

  const getAccentColor = () => {
    switch (customization.colorTheme) {
      case 'green': return '#16a34a';
      case 'red': return '#e11d48';
      case 'gray': return '#64748b';
      default: return '#0ea5e9';
    }
  };

  const accentColor = getAccentColor();

  return (
    <div 
      className={cn("bg-white p-8 min-h-[11in] text-gray-900", className)}
      style={fontStyle}
      data-testid="resume-template-modern"
    >
      {/* Header */}
      <header className="mb-8 relative">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
            <div className="w-full h-full rounded-full" style={{ backgroundColor: accentColor }}></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: accentColor }}></span>
                {personalInfo.phone}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: accentColor }}></span>
                {personalInfo.email}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: accentColor }}></span>
                {personalInfo.location}
              </span>
            </div>
            {(personalInfo.linkedin || personalInfo.github) && (
              <div className="flex flex-wrap gap-4 mt-2">
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} className="text-sm hover:underline" style={{ color: accentColor }}>
                    LinkedIn
                  </a>
                )}
                {personalInfo.github && (
                  <a href={personalInfo.github} className="text-sm hover:underline" style={{ color: accentColor }}>
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Summary */}
          {summary && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-8 h-1 rounded mr-3" style={{ backgroundColor: accentColor }}></div>
                <h2 className="text-2xl font-bold" style={{ color: accentColor }}>Profile</h2>
              </div>
              <p className="text-gray-700 leading-relaxed pl-11">{summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <div className="w-8 h-1 rounded mr-3" style={{ backgroundColor: accentColor }}></div>
                <h2 className="text-2xl font-bold" style={{ color: accentColor }}>Experience</h2>
              </div>
              <div className="space-y-6 pl-11">
                {workExperience.map((job) => (
                  <div key={job.id} className="relative">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold">{job.position}</h3>
                          <p className="font-medium text-gray-600">{job.company}</p>
                        </div>
                        <span className="text-sm px-3 py-1 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                          {job.startDate} - {job.endDate || 'Present'}
                        </span>
                      </div>
                      {job.description && (
                        <p className="text-gray-700 mb-3">{job.description}</p>
                      )}
                      {job.achievements.length > 0 && (
                        <ul className="space-y-2">
                          {job.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1 h-1 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: accentColor }}></div>
                              <span className="text-gray-700 text-sm">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-6 h-1 rounded mr-2" style={{ backgroundColor: accentColor }}></div>
                <h2 className="text-lg font-bold" style={{ color: accentColor }}>Education</h2>
              </div>
              <div className="space-y-4 pl-8">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-2 pl-4" style={{ borderColor: `${accentColor}30` }}>
                    <h3 className="font-semibold text-sm">{edu.degree}</h3>
                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                    <p className="text-gray-500 text-xs">{edu.graduationYear}</p>
                    {edu.field && <p className="text-gray-500 text-xs">{edu.field}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <div className="w-6 h-1 rounded mr-2" style={{ backgroundColor: accentColor }}></div>
                <h2 className="text-lg font-bold" style={{ color: accentColor }}>Skills</h2>
              </div>
              <div className="space-y-4 pl-8">
                {skills.map((skillCategory) => (
                  <div key={skillCategory.id}>
                    <h3 className="font-medium text-sm mb-2" style={{ color: accentColor }}>
                      {skillCategory.category}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skillCategory.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-2 py-1 rounded text-white"
                          style={{ backgroundColor: `${accentColor}80` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
