# Overview

This is an AI Resume Builder application built with React and TypeScript. The project provides a comprehensive solution for creating, editing, and exporting professional resumes. Users can either import existing PDF resumes for parsing and editing, or build new resumes from scratch through a guided multi-step process. The application features multiple professional templates, real-time customization options, ATS compatibility checking, and export capabilities to both PDF and DOCX formats.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application follows a modern React architecture with TypeScript, utilizing a component-based design pattern. The codebase is organized into clear separation of concerns with dedicated folders for components, pages, hooks, and utilities. The routing is handled by Wouter for client-side navigation between different flows (homepage, import, build steps, and editor).

## State Management
Zustand is implemented for global state management, specifically for resume data persistence across the application. The resume store manages all resume-related operations including personal information, work experience, education, skills, template selection, and customization options.

## UI Framework
The application uses shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system. Tailwind CSS handles all styling with a custom design token system defined in CSS variables for theming support.

## Text Editing
Slate.js is integrated for rich text editing capabilities within resume sections, allowing users to format and edit content with a structured approach to content management.

## File Processing
The application includes PDF parsing capabilities using pdf-lib for extracting text from uploaded resume files. A basic extraction system is implemented to parse common resume sections, though it's designed to be enhanced with AI/NLP services later.

## Export System
Multiple export formats are supported:
- PDF export using html2pdf.js for generating print-ready documents
- DOCX export using the docx library for Microsoft Word compatibility
- Built-in browser printing capabilities

## Template System
Four distinct resume templates are implemented (Minimalist, Professional, Creative, Modern), each with customizable styling options including fonts, colors, spacing, and layout configurations.

## Build Process
Vite serves as the build tool and development server, with TypeScript compilation and ES modules support. The project is configured for both development and production environments with appropriate optimizations.

# External Dependencies

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built UI component library based on Radix UI
- **Radix UI**: Headless UI primitives for accessibility
- **class-variance-authority**: Utility for managing CSS class variants
- **Lucide React**: Icon library for consistent iconography

## State and Data Management
- **Zustand**: Lightweight state management with Immer middleware
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation and type safety

## Text and Document Processing
- **Slate.js**: Rich text editor framework
- **pdf-lib**: PDF document manipulation and parsing
- **docx**: Microsoft Word document generation
- **html2pdf.js**: HTML to PDF conversion

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **ESLint/Prettier**: Code quality and formatting
- **Wouter**: Lightweight client-side routing

## Database and Backend
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: PostgreSQL database service
- **Express.js**: Backend API framework (minimal implementation)

The architecture is designed to be scalable for future enhancements including AI integration, user authentication, cloud storage, and advanced parsing capabilities.