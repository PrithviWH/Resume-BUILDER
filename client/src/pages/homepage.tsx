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
      <header className="border-b sticky top-0 z-50 glass">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2 animate-fade-in">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ResumeAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
                Templates
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
                Examples
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
                Tips
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-muted-foreground hover:shadow-soft transition-all duration-300">
                Sign In
              </Button>
              <Button className="shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">Sign Up</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-responsive-3xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
            AI Resume Builder
            <span className="gradient-primary bg-clip-text text-transparent block md:inline">
              {' '}(Fast, Easy & Free to Use)
            </span>
          </h1>
          <p className="text-responsive-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Land your next job with one of the best AI resume builders online. Work from your computer 
            or phone with dozens of recruiter-approved templates and add ready-to-use skills and phrases 
            in one click. Millions have trusted our resume maker and it's free to use!
          </p>
          
          {/* Main CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-scale-in">
            {/* Import Resume Card */}
            <Card 
              className="cursor-pointer group hover-lift shadow-soft hover:shadow-large border-0 bg-card/50 backdrop-blur-sm" 
              onClick={handleImportFlow}
              data-testid="card-import-resume"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-secondary rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-soft">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-responsive-xl font-semibold text-foreground mb-4">Import My Resume</h3>
                <p className="text-responsive-base text-muted-foreground mb-6 leading-relaxed">
                  Already have a resume? Upload your PDF and we'll help you make it better with AI 
                  suggestions and professional templates.
                </p>
                <Button className="shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
                  Upload Resume 
                  <Upload className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Build from Scratch Card */}
            <Card 
              className="cursor-pointer group hover-lift shadow-soft hover:shadow-large border-0 bg-card/50 backdrop-blur-sm" 
              onClick={handleBuildFlow}
              data-testid="card-build-resume"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-primary rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-soft">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-responsive-xl font-semibold text-foreground mb-4">Build My Resume from Scratch</h3>
                <p className="text-responsive-base text-muted-foreground mb-6 leading-relaxed">
                  Starting fresh? No problem! Our step-by-step wizard will guide you through creating 
                  a professional resume from the ground up.
                </p>
                <Button className="shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
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
