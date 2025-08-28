import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Plus, FileText, CheckCircle, Bot, Palette } from 'lucide-react';
import { useLocation } from 'wouter';
import { useResumeStore } from '@/store/resume-store';

export default function Homepage() {
  const [, setLocation] = useLocation();
  const { initializeResume } = useResumeStore();

  const handleImportFlow = () => {
    initializeResume();
    setLocation('/import');
  };

  const handleBuildFlow = () => {
    initializeResume();
    setLocation('/build/personal-info');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ResumeAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Examples
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Tips
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-muted-foreground">
                Sign In
              </Button>
              <Button>Sign Up</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            AI Resume Builder
            <span className="text-primary block md:inline">
              {' '}(Fast, Easy & Free to Use)
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Land your next job with one of the best AI resume builders online. Work from your computer 
            or phone with dozens of recruiter-approved templates and add ready-to-use skills and phrases 
            in one click. Millions have trusted our resume maker and it's free to use!
          </p>
          
          {/* Main CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Import Resume Card */}
            <Card 
              className="cursor-pointer group transition-all hover:shadow-lg hover:-translate-y-1" 
              onClick={handleImportFlow}
              data-testid="card-import-resume"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Upload className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">Import My Resume</h3>
                <p className="text-muted-foreground mb-6">
                  Already have a resume? Upload your PDF and we'll help you make it better with AI 
                  suggestions and professional templates.
                </p>
                <Button className="group-hover:bg-primary/90 transition-colors">
                  Upload Resume 
                  <Upload className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Build from Scratch Card */}
            <Card 
              className="cursor-pointer group transition-all hover:shadow-lg hover:-translate-y-1" 
              onClick={handleBuildFlow}
              data-testid="card-build-resume"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">Build My Resume from Scratch</h3>
                <p className="text-muted-foreground mb-6">
                  Starting fresh? No problem! Our step-by-step wizard will guide you through creating 
                  a professional resume from the ground up.
                </p>
                <Button className="group-hover:bg-primary/90 transition-colors">
                  Start Building 
                  <Plus className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose Our AI Resume Builder?
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to create a professional, ATS-friendly resume
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">AI-Powered</h3>
                  <p className="text-muted-foreground text-sm">
                    Smart suggestions and content optimization
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">ATS-Friendly</h3>
                  <p className="text-muted-foreground text-sm">
                    Optimized for applicant tracking systems
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Multiple Templates</h3>
                  <p className="text-muted-foreground text-sm">
                    Professional designs for every industry
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
