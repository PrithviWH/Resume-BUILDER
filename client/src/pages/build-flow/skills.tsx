import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileText, ArrowLeft, ArrowRight, Plus, Trash2, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useResumeStore } from '@/store/resume-store';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillsSchema, Skills } from '@shared/schema';
import { ProgressBar } from '@/components/progress-bar';
import { z } from 'zod';

const buildSteps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Review'];

const skillsFormSchema = z.object({
  skillCategories: z.array(skillsSchema),
});

type SkillsFormData = z.infer<typeof skillsFormSchema>;

export default function SkillsStep() {
  const [, setLocation] = useLocation();
  const { resume, addSkillCategory, updateSkillCategory, removeSkillCategory, setCurrentStep } = useResumeStore();
  const [newSkillInputs, setNewSkillInputs] = useState<Record<number, string>>({});

  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      skillCategories: resume?.skills.length ? resume.skills : [
        {
          id: '',
          category: 'Technical Skills',
          skills: [],
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skillCategories',
  });

  const handleBack = () => {
    setLocation('/build/education');
  };

  const handleNext = (data: SkillsFormData) => {
    // Clear existing skills and add new ones
    resume?.skills.forEach(skill => removeSkillCategory(skill.id));
    
    data.skillCategories.forEach(skillCategory => {
      if (skillCategory.category && skillCategory.skills.length > 0) {
        addSkillCategory(skillCategory);
      }
    });
    
    setCurrentStep(4);
    setLocation('/build/review');
  };

  const handleSkip = () => {
    setLocation('/editor');
  };

  const addNewSkillCategory = () => {
    append({
      id: '',
      category: '',
      skills: [],
    });
  };

  const addSkill = (categoryIndex: number) => {
    const newSkill = newSkillInputs[categoryIndex]?.trim();
    if (!newSkill) return;

    const currentSkills = form.getValues(`skillCategories.${categoryIndex}.skills`);
    if (!currentSkills.includes(newSkill)) {
      form.setValue(`skillCategories.${categoryIndex}.skills`, [...currentSkills, newSkill]);
    }
    
    setNewSkillInputs(prev => ({ ...prev, [categoryIndex]: '' }));
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const currentSkills = form.getValues(`skillCategories.${categoryIndex}.skills`);
    const newSkills = currentSkills.filter((_, index) => index !== skillIndex);
    form.setValue(`skillCategories.${categoryIndex}.skills`, newSkills);
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent, categoryIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(categoryIndex);
    }
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
              Step 4 of 5: Skills
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">Skills</h1>
            <p className="text-muted-foreground">Add your technical and professional skills</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <ProgressBar 
              currentStep={3} 
              totalSteps={5} 
              steps={buildSteps} 
            />
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
              {fields.map((field, categoryIndex) => (
                <Card key={field.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>
                      {categoryIndex === 0 ? 'Primary Skills' : `Skill Category ${categoryIndex + 1}`}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(categoryIndex)}
                        data-testid={`button-remove-category-${categoryIndex}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name={`skillCategories.${categoryIndex}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Programming Languages, Frameworks, Tools" 
                              {...field} 
                              data-testid={`input-category-${categoryIndex}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>Skills</FormLabel>
                      <div className="mt-2 space-y-4">
                        {/* Add new skill input */}
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Type a skill and press Enter"
                            value={newSkillInputs[categoryIndex] || ''}
                            onChange={(e) => setNewSkillInputs(prev => ({ 
                              ...prev, 
                              [categoryIndex]: e.target.value 
                            }))}
                            onKeyPress={(e) => handleSkillInputKeyPress(e, categoryIndex)}
                            data-testid={`input-new-skill-${categoryIndex}`}
                          />
                          <Button
                            type="button"
                            onClick={() => addSkill(categoryIndex)}
                            disabled={!newSkillInputs[categoryIndex]?.trim()}
                            data-testid={`button-add-skill-${categoryIndex}`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Display current skills */}
                        <div className="flex flex-wrap gap-2">
                          {form.watch(`skillCategories.${categoryIndex}.skills`).map((skill, skillIndex) => (
                            <Badge 
                              key={skillIndex} 
                              variant="secondary" 
                              className="flex items-center space-x-1 px-3 py-1"
                              data-testid={`badge-skill-${categoryIndex}-${skillIndex}`}
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                onClick={() => removeSkill(categoryIndex, skillIndex)}
                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                                data-testid={`button-remove-skill-${categoryIndex}-${skillIndex}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>

                        {form.watch(`skillCategories.${categoryIndex}.skills`).length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No skills added yet. Type a skill above and press Enter or click the + button.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewSkillCategory}
                  data-testid="button-add-category"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Category
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
                  Next: Review 
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
