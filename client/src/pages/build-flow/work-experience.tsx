import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileText, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useResumeStore } from '@/store/resume-store';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workExperienceSchema, WorkExperience } from '@shared/schema';
import { ProgressBar } from '@/components/progress-bar';
import { z } from 'zod';

const buildSteps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Review'];

const workExperienceFormSchema = z.object({
  experiences: z.array(workExperienceSchema),
});

type WorkExperienceFormData = z.infer<typeof workExperienceFormSchema>;

export default function WorkExperienceStep() {
  const [, setLocation] = useLocation();
  const { resume, addWorkExperience, updateWorkExperience, removeWorkExperience, setCurrentStep } = useResumeStore();

  const form = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceFormSchema),
    defaultValues: {
      experiences: resume?.workExperience.length ? resume.workExperience : [
        {
          id: '',
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          description: '',
          achievements: [''],
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experiences',
  });

  const handleBack = () => {
    setLocation('/build/personal-info');
  };

  const handleNext = (data: WorkExperienceFormData) => {
    // Clear existing work experience and add new ones
    resume?.workExperience.forEach(exp => removeWorkExperience(exp.id));
    
    data.experiences.forEach(exp => {
      if (exp.company && exp.position) {
        addWorkExperience({
          ...exp,
          achievements: exp.achievements.filter(a => a.trim() !== ''),
        });
      }
    });
    
    setCurrentStep(2);
    setLocation('/build/education');
  };

  const handleSkip = () => {
    setLocation('/editor');
  };

  const addExperience = () => {
    append({
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: [''],
    });
  };

  const addAchievement = (experienceIndex: number) => {
    const currentAchievements = form.getValues(`experiences.${experienceIndex}.achievements`);
    form.setValue(`experiences.${experienceIndex}.achievements`, [...currentAchievements, '']);
  };

  const removeAchievement = (experienceIndex: number, achievementIndex: number) => {
    const currentAchievements = form.getValues(`experiences.${experienceIndex}.achievements`);
    const newAchievements = currentAchievements.filter((_, index) => index !== achievementIndex);
    form.setValue(`experiences.${experienceIndex}.achievements`, newAchievements);
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
              Step 2 of 5: Work Experience
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Work Experience</h1>
            <p className="text-muted-foreground">Tell us about your professional background</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <ProgressBar 
              currentStep={1} 
              totalSteps={5} 
              steps={buildSteps} 
            />
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
              {fields.map((field, experienceIndex) => (
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>
                      {experienceIndex === 0 ? 'Current/Recent Position' : `Position ${experienceIndex + 1}`}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(experienceIndex)}
                        data-testid={`button-remove-experience-${experienceIndex}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`experiences.${experienceIndex}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="TechCorp Inc." 
                                {...field} 
                                data-testid={`input-company-${experienceIndex}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`experiences.${experienceIndex}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Senior Software Engineer" 
                                {...field} 
                                data-testid={`input-position-${experienceIndex}`}
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
                        name={`experiences.${experienceIndex}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Jan 2021" 
                                {...field} 
                                data-testid={`input-start-date-${experienceIndex}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`experiences.${experienceIndex}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Present" 
                                {...field} 
                                disabled={form.watch(`experiences.${experienceIndex}.isCurrent`)}
                                data-testid={`input-end-date-${experienceIndex}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`experiences.${experienceIndex}.isCurrent`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) {
                                  form.setValue(`experiences.${experienceIndex}.endDate`, '');
                                }
                              }}
                              data-testid={`checkbox-is-current-${experienceIndex}`}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>I currently work here</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${experienceIndex}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief overview of your role and responsibilities..."
                              className="resize-none"
                              rows={3}
                              {...field} 
                              data-testid={`textarea-description-${experienceIndex}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label className="text-sm font-medium">Key Achievements</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Add bullet points highlighting your accomplishments and impact
                      </p>
                      {form.watch(`experiences.${experienceIndex}.achievements`).map((_, achievementIndex) => (
                        <div key={achievementIndex} className="flex items-center space-x-2 mb-2">
                          <FormField
                            control={form.control}
                            name={`experiences.${experienceIndex}.achievements.${achievementIndex}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input 
                                    placeholder="Led development of microservices architecture..."
                                    {...field} 
                                    data-testid={`input-achievement-${experienceIndex}-${achievementIndex}`}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {form.watch(`experiences.${experienceIndex}.achievements`).length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievement(experienceIndex, achievementIndex)}
                              data-testid={`button-remove-achievement-${experienceIndex}-${achievementIndex}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addAchievement(experienceIndex)}
                        className="mt-2"
                        data-testid={`button-add-achievement-${experienceIndex}`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperience}
                  data-testid="button-add-experience"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Position
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
                  Next: Education 
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
