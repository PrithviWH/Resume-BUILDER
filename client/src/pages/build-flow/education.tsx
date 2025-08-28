import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileText, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useResumeStore } from '@/store/resume-store';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, Education } from '@shared/schema';
import { ProgressBar } from '@/components/progress-bar';
import { z } from 'zod';

const buildSteps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Review'];

const educationFormSchema = z.object({
  education: z.array(educationSchema),
});

type EducationFormData = z.infer<typeof educationFormSchema>;

export default function EducationStep() {
  const [, setLocation] = useLocation();
  const { resume, addEducation, updateEducation, removeEducation, setCurrentStep } = useResumeStore();

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      education: resume?.education.length ? resume.education : [
        {
          id: '',
          institution: '',
          degree: '',
          field: '',
          graduationYear: '',
          gpa: '',
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  const handleBack = () => {
    setLocation('/build/work-experience');
  };

  const handleNext = (data: EducationFormData) => {
    // Clear existing education and add new ones
    resume?.education.forEach(edu => removeEducation(edu.id));
    
    data.education.forEach(edu => {
      if (edu.institution && edu.degree) {
        addEducation(edu);
      }
    });
    
    setCurrentStep(3);
    setLocation('/build/skills');
  };

  const handleSkip = () => {
    setLocation('/editor');
  };

  const addEducationEntry = () => {
    append({
      id: '',
      institution: '',
      degree: '',
      field: '',
      graduationYear: '',
      gpa: '',
    });
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
              Step 3 of 5: Education
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Education</h1>
            <p className="text-muted-foreground">Tell us about your educational background</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <ProgressBar 
              currentStep={2} 
              totalSteps={5} 
              steps={buildSteps} 
            />
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
              {fields.map((field, educationIndex) => (
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>
                      {educationIndex === 0 ? 'Most Recent Education' : `Education ${educationIndex + 1}`}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(educationIndex)}
                        data-testid={`button-remove-education-${educationIndex}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`education.${educationIndex}.institution`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School/University</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="University of California, Berkeley" 
                                {...field} 
                                data-testid={`input-institution-${educationIndex}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`education.${educationIndex}.degree`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Degree</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Bachelor of Science" 
                                {...field} 
                                data-testid={`input-degree-${educationIndex}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`education.${educationIndex}.field`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field of Study (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Computer Science" 
                                {...field} 
                                data-testid={`input-field-${educationIndex}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`education.${educationIndex}.graduationYear`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Graduation Year</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="2019" 
                                {...field} 
                                data-testid={`input-graduation-year-${educationIndex}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`education.${educationIndex}.gpa`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPA (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="3.8" 
                              {...field} 
                              data-testid={`input-gpa-${educationIndex}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducationEntry}
                  data-testid="button-add-education"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Education
                </Button>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-8 border-t">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleSkip}
                  data-testid="button-skip"
                >
                  Skip, Jump to Resume Editor
                </Button>
                <Button 
                  type="submit"
                  data-testid="button-next"
                >
                  Next: Skills 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
