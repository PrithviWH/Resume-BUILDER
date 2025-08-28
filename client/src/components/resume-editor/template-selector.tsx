import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Template } from '@shared/schema';
import { useResumeStore } from '@/store/resume-store';
import { cn } from '@/lib/utils';

const templates: { id: Template; name: string; description: string }[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple design with subtle borders',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional layout with accent colors',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Sidebar layout with bold design elements',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with geometric elements',
  },
];

export function TemplateSelector() {
  const { resume, switchTemplate } = useResumeStore();
  const currentTemplate = resume?.template || 'professional';

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Templates</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              currentTemplate === template.id
                ? "ring-2 ring-primary border-primary"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => switchTemplate(template.id)}
            data-testid={`template-${template.id}`}
          >
            <CardContent className="p-3">
              {/* Template Preview */}
              <div className="bg-muted rounded border h-16 mb-2 flex items-center justify-center">
                <div className="text-xs text-muted-foreground">
                  {template.id === 'minimalist' && (
                    <div>
                      <div className="h-1 bg-foreground w-8 mb-1"></div>
                      <div className="h-1 bg-muted-foreground w-6"></div>
                    </div>
                  )}
                  {template.id === 'professional' && (
                    <div>
                      <div className="h-1 bg-primary w-8 mb-1"></div>
                      <div className="h-1 bg-muted-foreground w-6"></div>
                    </div>
                  )}
                  {template.id === 'creative' && (
                    <div className="flex">
                      <div className="w-3 h-12 bg-accent rounded-sm mr-2"></div>
                      <div>
                        <div className="h-1 bg-foreground w-6 mb-1"></div>
                        <div className="h-1 bg-muted-foreground w-4"></div>
                      </div>
                    </div>
                  )}
                  {template.id === 'modern' && (
                    <div>
                      <div className="h-1 bg-foreground w-8 mb-1"></div>
                      <div className="h-1 bg-primary w-6"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-xs font-medium",
                  currentTemplate === template.id ? "text-primary" : "text-foreground"
                )}>
                  {template.name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
