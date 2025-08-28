import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResumeStore } from '@/store/resume-store';
import { Plus, Minus } from 'lucide-react';

const fontOptions = [
  { value: 'Inter', label: 'Inter (Recommended)' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Helvetica', label: 'Helvetica' },
];

const lineSpacingOptions = [
  { value: 1.0, label: 'Normal (1.0)' },
  { value: 1.15, label: 'Relaxed (1.15)' },
  { value: 1.5, label: 'Loose (1.5)' },
];

const colorThemes = [
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'green', name: 'Green', color: '#10b981' },
  { id: 'red', name: 'Red', color: '#ef4444' },
  { id: 'gray', name: 'Gray', color: '#6b7280' },
];

export function CustomizationPanel() {
  const { resume, updateCustomization } = useResumeStore();
  
  if (!resume) return null;
  
  const { customization } = resume;

  const handleFontChange = (fontFamily: string) => {
    updateCustomization({ fontFamily });
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(10, Math.min(16, customization.fontSize + delta));
    updateCustomization({ fontSize: newSize });
  };

  const handleColorChange = (colorTheme: string) => {
    updateCustomization({ colorTheme });
  };

  const handleLineSpacingChange = (lineSpacing: string) => {
    updateCustomization({ lineSpacing: parseFloat(lineSpacing) });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-foreground">Customize</h3>
      
      {/* Font Selection */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 block">Font</Label>
        <Select value={customization.fontFamily} onValueChange={handleFontChange}>
          <SelectTrigger data-testid="select-font">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 block">Font Size</Label>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFontSizeChange(-1)}
            disabled={customization.fontSize <= 10}
            data-testid="button-decrease-font-size"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-sm text-foreground min-w-12 text-center" data-testid="text-font-size">
            {customization.fontSize}pt
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFontSizeChange(1)}
            disabled={customization.fontSize >= 16}
            data-testid="button-increase-font-size"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Color Theme */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 block">Color Theme</Label>
        <div className="flex space-x-3">
          {colorThemes.map((theme) => (
            <button
              key={theme.id}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                customization.colorTheme === theme.id
                  ? 'border-gray-900 scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: theme.color }}
              onClick={() => handleColorChange(theme.id)}
              title={theme.name}
              data-testid={`color-${theme.id}`}
            />
          ))}
        </div>
      </div>

      {/* Line Spacing */}
      <div>
        <Label className="text-sm font-medium text-foreground mb-2 block">Line Spacing</Label>
        <Select 
          value={customization.lineSpacing.toString()} 
          onValueChange={handleLineSpacingChange}
        >
          <SelectTrigger data-testid="select-line-spacing">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {lineSpacingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
