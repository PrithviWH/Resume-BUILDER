import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Eye, Edit } from 'lucide-react';
import { useLocation } from 'wouter';
import { useResumeStore } from '@/store/resume-store';
import { ProgressBar } from '@/components/progress-bar';

const buildSteps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Review'];

export default function ReviewStep() {
  const [, setLocation] = useLocation();
  const { resume } = useResumeStore();

  if (!resume) {
    setLocation('/');
    return null;
  }

  const handleBack = () => {
    setLocation('/build/skills');
  };

  const handleEditPersonalInfo = () => {
    setLocation('/build/personal-info');
  };

  const handleEditWorkExperience = () => {
    setLocation('/build/work-experience');
  };

  const handleEditEducation = () => {
    setLocation('/build/education');
  };

  const handleEditSkills = () => {
    setLocation('/build/skills');
  };

  const handleProceedToEditor = () => {
    setLocation('/editor');
  };

  const { personalInfo, workExperience, education, skills, summary } = resume;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">ResumeAI</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Step 5 of 5: Review
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Review Your Information</h1>
            <p className="text-muted-foreground">
              Review your information before creating your resume. You can edit any section or proceed to the editor.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <ProgressBar 
              currentStep={4} 
              totalSteps={5} 
              steps={buildSteps} 
            />
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center space-x-2">
                  <span>Personal Information</span>
                  {(!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) && (
                    <span className="text-sm text-destructive">(Incomplete)</span>
                  )}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditPersonalInfo}
                  data-testid="button-edit-personal-info"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}
                  </div>
                  <div>
                    <strong>Email:</strong> {personalInfo.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {personalInfo.phone}
                  </div>
                  <div>
                    <strong>Location:</strong> {personalInfo.location}
                  </div>
                  {personalInfo.linkedin && (
                    <div>
                      <strong>LinkedIn:</strong> {personalInfo.linkedin}
                    </div>
                  )}
                  {personalInfo.github && (
                    <div>
                      <strong>GitHub:</strong> {personalInfo.github}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center space-x-2">
                  <span>Work Experience</span>
                  <span className="text-sm text-muted-foreground">({workExperience.length} entries)</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditWorkExperience}
                  data-testid="button-edit-work-experience"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                {workExperience.length > 0 ? (
                  <div className="space-y-4">
                    {workExperience.map((job, index) => (
                      <div key={job.id} className="border-l-2 border-primary/20 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{job.position}</h4>
                            <p className="text-muted-foreground">{job.company}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {job.startDate} - {job.endDate || 'Present'}
                          </span>
                        </div>
                        {job.achievements.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              {job.achievements.length} achievement{job.achievements.length !== 1 ? 's' : ''} listed
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No work experience added yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center space-x-2">
                  <span>Education</span>
                  <span className="text-sm text-muted-foreground">({education.length} entries)</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditEducation}
                  data-testid="button-edit-education"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                {education.length > 0 ? (
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
                        </div>
                        <span className="text-sm text-muted-foreground">{edu.graduationYear}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No education added yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center space-x-2">
                  <span>Skills</span>
                  <span className="text-sm text-muted-foreground">({skills.length} categories)</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEditSkills}
                  data-testid="button-edit-skills"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                {skills.length > 0 ? (
                  <div className="space-y-3">
                    {skills.map((skillCategory) => (
                      <div key={skillCategory.id}>
                        <span className="font-medium">{skillCategory.category}:</span>
                        <span className="ml-2 text-muted-foreground">
                          {skillCategory.skills.join(', ')} ({skillCategory.skills.length} skills)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No skills added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-center pt-12">
            <Button 
              onClick={handleProceedToEditor} 
              size="lg"
              data-testid="button-proceed-to-editor"
            >
              <Eye className="w-5 h-5 mr-2" />
              Proceed to Resume Editor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
