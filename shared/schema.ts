import { z } from "zod";

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

// Work Experience Schema
export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
});

// Education Schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  graduationYear: z.string().min(1, "Graduation year is required"),
  gpa: z.string().optional(),
});

// Skills Schema
export const skillsSchema = z.object({
  id: z.string(),
  category: z.string().min(1, "Category is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

// Resume Schema
export const resumeSchema = z.object({
  id: z.string(),
  personalInfo: personalInfoSchema,
  summary: z.string().optional(),
  workExperience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillsSchema).default([]),
  template: z.enum(['minimalist', 'professional', 'creative', 'modern']).default('professional'),
  customization: z.object({
    fontFamily: z.string().default('Inter'),
    fontSize: z.number().default(12),
    colorTheme: z.string().default('blue'),
    lineSpacing: z.number().default(1.15),
  }).default({}),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

// Export types
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Resume = z.infer<typeof resumeSchema>;

// Insert schemas for forms
export const insertPersonalInfoSchema = personalInfoSchema;
export const insertWorkExperienceSchema = workExperienceSchema.omit({ id: true });
export const insertEducationSchema = educationSchema.omit({ id: true });
export const insertSkillsSchema = skillsSchema.omit({ id: true });

export type InsertPersonalInfo = z.infer<typeof insertPersonalInfoSchema>;
export type InsertWorkExperience = z.infer<typeof insertWorkExperienceSchema>;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type InsertSkills = z.infer<typeof insertSkillsSchema>;

// Template types
export type Template = 'minimalist' | 'professional' | 'creative' | 'modern';

// Customization types
export type CustomizationOptions = {
  fontFamily: string;
  fontSize: number;
  colorTheme: string;
  lineSpacing: number;
};
