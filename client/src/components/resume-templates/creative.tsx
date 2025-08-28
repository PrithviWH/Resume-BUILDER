import React from 'react';
import { Resume } from '@shared/schema';
import { cn } from '@/lib/utils';

interface CreativeTemplateProps {
  resume: Resume;
  className?: string;
}

export function CreativeTemplate({ resume, className }: CreativeTemplateProps) {
  const { personalInfo, summary, workExperience, education, skills, customization } = resume;

  const fontStyle = {
    fontFamily: customization.fontFamily,
    fontSize: `${customization.fontSize}pt`,
    lineHeight: customization.lineSpacing,
  };

  const getAccentColor = () => {
    switch (customization.colorTheme) {
      case 'green': return '#059669';
      case 'red': return '#dc2626';
      case 'gray': return '#4b5563';
      default: return '#7c3aed';
    }
  };

  const accentColor = getAccentColor();

  return (
    <div 
      className={cn("bg-white min-h-[11in] text-gray-900 flex", className)}
      style={fontStyle}
      data-testid="resume-template-creative"
    >
      {/* Sidebar */}
      <div className="w-1/3 p-6" style={{ backgroundColor: accentColor }}>
        <div className="text-white">
          {/* Personal Info */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold">
                {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-center mb-4">
              {personalInfo.firstName}<br />{personalInfo.lastName}
            </h1>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-white/30">
              Contact
            </h2>
            <div className="space-y-3 text-sm">
              <div>{personalInfo.phone}</div>
              <div className="break-words">{personalInfo.email}</div>
              <div>{personalInfo.location}</div>
              {personalInfo.linkedin && (
                <div className="break-words">{personalInfo.linkedin}</div>
              )}
              {personalInfo.github && (
                <div className="break-words">{personalInfo.github}</div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-white/30">
                Skills
              </h2>
              <div className="space-y-4">
                {skills.map((skillCategory) => (
                  <div key={skillCategory.id}>
                    <h3 className="font-medium mb-2 text-sm">{skillCategory.category}</h3>
                    <div className="space-y-1">
                      {skillCategory.skills.map((skill, index) => (
                        <div key={index} className="text-xs bg-white/20 px-2 py-1 rounded inline-block mr-1 mb-1">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-white/30">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-sm">
                    <div className="font-medium">{edu.degree}</div>
                    <div className="text-white/80">{edu.institution}</div>
                    <div className="text-white/60 text-xs">{edu.graduationYear}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Summary */}
        {summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
              Profile
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-6">
              {workExperience.map((job, index) => (
                <div key={job.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-2 top-2">
                    <div 
                      className="w-4 h-4 rounded-full border-4 border-white shadow-md"
                      style={{ backgroundColor: accentColor }}
                    ></div>
                  </div>
                  
                  {/* Timeline line */}
                  {index < workExperience.length - 1 && (
                    <div 
                      className="absolute left-0 top-6 w-0.5 h-full"
                      style={{ backgroundColor: `${accentColor}30` }}
                    ></div>
                  )}
                  
                  <div className="ml-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{job.position}</h3>
                        <p className="font-medium" style={{ color: accentColor }}>{job.company}</p>
                      </div>
                      <span className="text-gray-500 text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${accentColor}15` }}>
                        {job.startDate} - {job.endDate || 'Present'}
                      </span>
                    </div>
                    {job.description && (
                      <p className="text-gray-700 mb-3">{job.description}</p>
                    )}
                    {job.achievements.length > 0 && (
                      <ul className="space-y-2">
                        {job.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: accentColor }}></span>
                            <span className="text-gray-700">{achievement}</span>
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
    </div>
  );
}
