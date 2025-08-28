import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Resume, PersonalInfo, WorkExperience, Education, Skills, Template, CustomizationOptions } from '@shared/schema';

interface ResumeStore {
  resume: Resume | null;
  isLoading: boolean;
  currentStep: number;
  
  // Actions
  initializeResume: () => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addWorkExperience: (experience: WorkExperience) => void;
  updateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkillCategory: (skills: Skills) => void;
  updateSkillCategory: (id: string, skills: Partial<Skills>) => void;
  removeSkillCategory: (id: string) => void;
  updateSummary: (summary: string) => void;
  switchTemplate: (template: Template) => void;
  updateCustomization: (customization: Partial<CustomizationOptions>) => void;
  setCurrentStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  resetResume: () => void;
  importResumeData: (data: Partial<Resume>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultResume = (): Resume => ({
  id: generateId(),
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  template: 'professional',
  customization: {
    fontFamily: 'Inter',
    fontSize: 12,
    colorTheme: 'blue',
    lineSpacing: 1.15,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useResumeStore = create<ResumeStore>()(
  immer((set) => ({
    resume: null,
    isLoading: false,
    currentStep: 0,

    initializeResume: () =>
      set((state) => {
        state.resume = createDefaultResume();
      }),

    updatePersonalInfo: (info) =>
      set((state) => {
        if (state.resume) {
          state.resume.personalInfo = info;
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    addWorkExperience: (experience) =>
      set((state) => {
        if (state.resume) {
          state.resume.workExperience.push({ ...experience, id: generateId() });
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    updateWorkExperience: (id, experience) =>
      set((state) => {
        if (state.resume) {
          const index = state.resume.workExperience.findIndex((exp) => exp.id === id);
          if (index !== -1) {
            state.resume.workExperience[index] = { ...state.resume.workExperience[index], ...experience };
            state.resume.updatedAt = new Date().toISOString();
          }
        }
      }),

    removeWorkExperience: (id) =>
      set((state) => {
        if (state.resume) {
          state.resume.workExperience = state.resume.workExperience.filter((exp) => exp.id !== id);
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    addEducation: (education) =>
      set((state) => {
        if (state.resume) {
          state.resume.education.push({ ...education, id: generateId() });
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    updateEducation: (id, education) =>
      set((state) => {
        if (state.resume) {
          const index = state.resume.education.findIndex((edu) => edu.id === id);
          if (index !== -1) {
            state.resume.education[index] = { ...state.resume.education[index], ...education };
            state.resume.updatedAt = new Date().toISOString();
          }
        }
      }),

    removeEducation: (id) =>
      set((state) => {
        if (state.resume) {
          state.resume.education = state.resume.education.filter((edu) => edu.id !== id);
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    addSkillCategory: (skills) =>
      set((state) => {
        if (state.resume) {
          state.resume.skills.push({ ...skills, id: generateId() });
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    updateSkillCategory: (id, skills) =>
      set((state) => {
        if (state.resume) {
          const index = state.resume.skills.findIndex((skill) => skill.id === id);
          if (index !== -1) {
            state.resume.skills[index] = { ...state.resume.skills[index], ...skills };
            state.resume.updatedAt = new Date().toISOString();
          }
        }
      }),

    removeSkillCategory: (id) =>
      set((state) => {
        if (state.resume) {
          state.resume.skills = state.resume.skills.filter((skill) => skill.id !== id);
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    updateSummary: (summary) =>
      set((state) => {
        if (state.resume) {
          state.resume.summary = summary;
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    switchTemplate: (template) =>
      set((state) => {
        if (state.resume) {
          state.resume.template = template;
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    updateCustomization: (customization) =>
      set((state) => {
        if (state.resume) {
          state.resume.customization = { ...state.resume.customization, ...customization };
          state.resume.updatedAt = new Date().toISOString();
        }
      }),

    setCurrentStep: (step) =>
      set((state) => {
        state.currentStep = step;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    resetResume: () =>
      set((state) => {
        state.resume = null;
        state.currentStep = 0;
        state.isLoading = false;
      }),

    importResumeData: (data) =>
      set((state) => {
        if (state.resume) {
          state.resume = { ...state.resume, ...data, updatedAt: new Date().toISOString() };
        }
      }),
  }))
);
