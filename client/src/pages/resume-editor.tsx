import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, ArrowLeft, Download, FileType, Share2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useResumeStore } from '@/store/resume-store';
import { TemplateSelector } from '@/components/resume-editor/template-selector';
import { CustomizationPanel } from '@/components/resume-editor/customization-panel';
import { ATSChecker } from '@/components/resume-editor/ats-checker';
import { MinimalistTemplate } from '@/components/resume-templates/minimalist';
import { ProfessionalTemplate } from '@/components/resume-templates/professional';
import { CreativeTemplate } from '@/components/resume-templates/creative';
import { ModernTemplate } from '@/components/resume-templates/modern';
import { exportToPDF, exportToDOCX, generateShareableLink } from '@/lib/export-utils';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ResumeEditor() {
  const [, setLocation] = useLocation();
  const { resume } = useResumeStore();
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);

  if (!resume) {
    setLocation('/');
    return null;
  }

  const handleBack = () => {
    setLocation('/');
  };

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      await exportToPDF(resumeRef.current, `${resume.personalInfo.firstName}-${resume.personalInfo.lastName}-resume.pdf`);
      toast({
        title: "PDF exported successfully!",
        description: "Your resume has been downloaded as a PDF file.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportDOCX = async () => {
    try {
      await exportToDOCX(resume, `${resume.personalInfo.firstName}-${resume.personalInfo.lastName}-resume.docx`);
      toast({
        title: "DOCX exported successfully!",
        description: "Your resume has been downloaded as a Word document.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const shareableLink = generateShareableLink(resume.id);
    navigator.clipboard.writeText(shareableLink);
    toast({
      title: "Link copied!",
      description: "Shareable link has been copied to your clipboard.",
    });
  };

  const renderTemplate = () => {
    const templateProps = { resume, className: "transform scale-90 origin-top-left" };
    
    switch (resume.template) {
      case 'minimalist':
        return <MinimalistTemplate {...templateProps} />;
      case 'creative':
        return <CreativeTemplate {...templateProps} />;
      case 'modern':
        return <ModernTemplate {...templateProps} />;
      default:
        return <ProfessionalTemplate {...templateProps} />;
    }
  };

  // Calculate ATS score for display
  const calculateATSScore = () => {
    let score = 0;
    const maxScore = 100;

    // Basic scoring logic
    const atsFreindlyFonts = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Calibri'];
    if (atsFreindlyFonts.includes(resume.customization.fontFamily)) score += 20;
    
    const totalContent = (resume.summary || '').length + 
      resume.workExperience.reduce((acc, job) => acc + job.achievements.join(' ').length, 0);
    if (totalContent > 300) score += 15;
    
    if (resume.personalInfo.email && resume.personalInfo.phone) score += 15;
    if (resume.skills.length > 0) score += 15;
    if (resume.workExperience.length > 0) score += 20;
    if (resume.workExperience.some(job => job.achievements.length > 0)) score += 15;

    return Math.round((score / maxScore) * 100);
  };

  const atsScore = calculateATSScore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 glass shadow-soft">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-fade-in">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                data-testid="button-back"
                className="hover:shadow-soft transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">ResumeAI</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium">Resume Editor</div>
            </div>
            
            {/* Editor Actions */}
            <div className="flex items-center space-x-3 animate-slide-down">
              {/* ATS Score */}
              <div className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium shadow-soft transition-all duration-300",
                atsScore >= 80 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                atsScore >= 60 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              )} data-testid="ats-score-header">
                <FileText className="w-4 h-4" />
                <span>ATS Score: {atsScore}%</span>
              </div>
              
              {/* Export Options */}
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
                  data-testid="button-export-pdf"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </Button>
                <Button 
                  variant="secondary"
                  onClick={handleExportDOCX}
                  className="flex items-center space-x-2 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
                  data-testid="button-export-docx"
                >
                  <FileType className="w-4 h-4" />
                  <span>DOCX</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center space-x-2 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Editor Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen animate-fade-in">
        {/* Sidebar */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r bg-card/50 backdrop-blur-sm overflow-y-auto shadow-soft animate-slide-up">
          <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
            {/* Templates Section */}
            <div className="animate-slide-up">
              <TemplateSelector />
            </div>
            
            <Separator className="my-4 lg:my-6" />
            
            {/* Customization Section */}
            <div className="animate-slide-up">
              <CustomizationPanel />
            </div>
            
            <Separator className="my-4 lg:my-6" />
            
            {/* ATS Optimization Checker */}
            <div className="animate-slide-up">
              <ATSChecker />
            </div>
          </div>
        </div>

        {/* Resume Preview Area */}
        <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 p-4 lg:p-8 overflow-y-auto animate-scale-in">
          <div className="max-w-4xl mx-auto">
            <div 
              ref={resumeRef}
              className="resume-preview bg-white shadow-large rounded-xl overflow-hidden hover-lift border border-border/50 scale-65 lg:scale-75 xl:scale-80 origin-top-left w-[155%] lg:w-[135%] xl:w-[125%]"
              data-testid="resume-preview"
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
