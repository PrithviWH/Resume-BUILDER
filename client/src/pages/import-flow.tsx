import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { FileUpload } from '@/components/file-upload';
import { useResumeStore } from '@/store/resume-store';

export default function ImportFlow() {
  const [, setLocation] = useLocation();
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const { resume } = useResumeStore();

  const handleBack = () => {
    setLocation('/');
  };

  const handleContinue = () => {
    setLocation('/editor');
  };

  const handleUploadComplete = () => {
    setHasUploadedFile(true);
  };

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
              Step 1 of 2: Import Resume
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Import Your Resume</h1>
          <p className="text-muted-foreground mb-12">
            Upload your existing resume and we'll help you make it even better
          </p>
          
          <FileUpload onUploadComplete={handleUploadComplete} />
          
          {hasUploadedFile && resume && (
            <div className="mt-8">
              <Button 
                onClick={handleContinue} 
                className="px-8 py-3"
                data-testid="button-continue"
              >
                Continue to Editor 
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {!hasUploadedFile && (
            <div className="mt-8">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/build/personal-info')}
                data-testid="button-build-from-scratch"
              >
                Or build from scratch
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
