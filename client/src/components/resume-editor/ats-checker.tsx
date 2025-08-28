import React, { useMemo } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useResumeStore } from '@/store/resume-store';
import { cn } from '@/lib/utils';

interface ATSCheck {
  id: string;
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
}

export function ATSChecker() {
  const { resume } = useResumeStore();
  
  const atsChecks = useMemo((): ATSCheck[] => {
    if (!resume) return [];

    const checks: ATSCheck[] = [];
    
    // Font check
    const atsFreindlyFonts = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Calibri'];
    checks.push({
      id: 'font',
      title: atsFreindlyFonts.includes(resume.customization.fontFamily) ? 'ATS-friendly font' : 'Font compatibility',
      description: atsFreindlyFonts.includes(resume.customization.fontFamily) 
        ? 'Great font choice for ATS parsing!'
        : 'Consider using Arial, Helvetica, or Georgia for better ATS compatibility.',
      status: atsFreindlyFonts.includes(resume.customization.fontFamily) ? 'pass' : 'warning',
      score: atsFreindlyFonts.includes(resume.customization.fontFamily) ? 20 : 10,
    });

    // Content length check
    const totalContent = (resume.summary || '').length + 
      resume.workExperience.reduce((acc, job) => acc + job.achievements.join(' ').length, 0);
    
    checks.push({
      id: 'content-length',
      title: totalContent > 300 ? 'Sufficient content' : 'Content length',
      description: totalContent > 300 
        ? 'Your resume has good content depth.'
        : 'Consider adding more details to your experience and achievements.',
      status: totalContent > 300 ? 'pass' : 'warning',
      score: totalContent > 300 ? 15 : 5,
    });

    // Contact information check
    const hasRequiredContact = resume.personalInfo.email && resume.personalInfo.phone;
    checks.push({
      id: 'contact',
      title: hasRequiredContact ? 'Complete contact info' : 'Missing contact info',
      description: hasRequiredContact 
        ? 'All essential contact information is present.'
        : 'Ensure you have email and phone number listed.',
      status: hasRequiredContact ? 'pass' : 'fail',
      score: hasRequiredContact ? 15 : 0,
    });

    // Keywords check
    const hasKeywords = resume.skills.length > 0;
    checks.push({
      id: 'keywords',
      title: hasKeywords ? 'Skills section present' : 'Add relevant skills',
      description: hasKeywords 
        ? 'Skills section helps with keyword matching.'
        : 'Add a skills section with industry-relevant keywords.',
      status: hasKeywords ? 'pass' : 'warning',
      score: hasKeywords ? 15 : 5,
    });

    // Work experience check
    const hasWorkExperience = resume.workExperience.length > 0;
    checks.push({
      id: 'experience',
      title: hasWorkExperience ? 'Work experience included' : 'Add work experience',
      description: hasWorkExperience 
        ? 'Work experience section is present.'
        : 'Include your work experience for better ATS scoring.',
      status: hasWorkExperience ? 'pass' : 'fail',
      score: hasWorkExperience ? 20 : 0,
    });

    // Achievement bullets check
    const hasAchievements = resume.workExperience.some(job => job.achievements.length > 0);
    checks.push({
      id: 'achievements',
      title: hasAchievements ? 'Achievement bullets' : 'Add achievement bullets',
      description: hasAchievements 
        ? 'Great use of achievement-focused bullet points!'
        : 'Use bullet points to highlight your achievements and impact.',
      status: hasAchievements ? 'pass' : 'warning',
      score: hasAchievements ? 15 : 5,
    });

    return checks;
  }, [resume]);

  const totalScore = atsChecks.reduce((acc, check) => acc + check.score, 0);
  const maxScore = 100;
  const scorePercentage = Math.round((totalScore / maxScore) * 100);

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          ATS Optimization
        </h3>
        <div className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          scorePercentage >= 80 ? "bg-green-100 text-green-800" :
          scorePercentage >= 60 ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        )} data-testid="ats-score">
          {scorePercentage}%
        </div>
      </div>

      <div className="space-y-3">
        {atsChecks.map((check) => (
          <div 
            key={check.id} 
            className={cn(
              "flex items-start space-x-3 p-3 rounded-lg border",
              getStatusColor(check.status)
            )}
            data-testid={`ats-check-${check.id}`}
          >
            {getStatusIcon(check.status)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {check.title}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {check.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {scorePercentage < 80 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">
            Improve your ATS score
          </p>
          <p className="text-sm text-blue-800">
            Address the warnings above to improve your resume's compatibility with Applicant Tracking Systems.
          </p>
        </div>
      )}
    </div>
  );
}
