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
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-3">
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
              <div className="text-sm text-muted-foreground">Resume Editor</div>
            </div>
            
            {/* Editor Actions */}
            <div className="flex items-center space-x-3">
              {/* ATS Score */}
              <div className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium",
                atsScore >= 80 ? "bg-green-100 text-green-800" :
                atsScore >= 60 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )} data-testid="ats-score-header">
                <FileText className="w-4 h-4" />
                <span>ATS Score: {atsScore}%</span>
              </div>
              
              {/* Export Options */}
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2"
                  data-testid="button-export-pdf"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </Button>
                <Button 
                  variant="secondary"
                  onClick={handleExportDOCX}
                  className="flex items-center space-x-2"
                  data-testid="button-export-docx"
                >
                  <FileType className="w-4 h-4" />
                  <span>DOCX</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center space-x-2"
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
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Templates Section */}
            <TemplateSelector />
            
            <Separator />
            
            {/* Customization Section */}
            <CustomizationPanel />
            
            <Separator />
            
            {/* ATS Optimization Checker */}
            <ATSChecker />
          </div>
        </div>

        {/* Resume Preview Area */}
        <div className="flex-1 bg-muted p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div 
              ref={resumeRef}
              className="resume-preview bg-white shadow-2xl rounded-lg overflow-hidden"
              style={{
                transform: 'scale(0.8)',
                transformOrigin: 'top left',
                width: '125%',
              }}
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
