import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  className?: string;
}

export function ProgressBar({ currentStep, totalSteps, steps, className }: ProgressBarProps) {
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4">
        <div className="bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "text-sm transition-colors",
              index <= currentStep
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
