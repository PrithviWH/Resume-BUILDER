import React, { useMemo, useCallback } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { cn } from '@/lib/utils';

interface SlateEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SlateEditor({ value, onChange, placeholder, className }: SlateEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue: Descendant[] = useMemo(() => {
    if (!value) {
      return [{ type: 'paragraph', children: [{ text: '' }] }];
    }
    
    const lines = value.split('\n');
    return lines.map(line => ({
      type: 'paragraph',
      children: [{ text: line }],
    }));
  }, [value]);

  const handleChange = useCallback((newValue: Descendant[]) => {
    const text = newValue
      .map(n => {
        if ('children' in n) {
          return n.children.map(child => {
            if ('text' in child) {
              return child.text;
            }
            return '';
          }).join('');
        }
        return '';
      })
      .join('\n');
    
    onChange(text);
  }, [onChange]);

  return (
    <div className={cn("min-h-[100px] p-3 border rounded-md focus-within:ring-2 focus-within:ring-ring", className)}>
      <Slate editor={editor} initialValue={initialValue} onValueChange={handleChange}>
        <Editable
          placeholder={placeholder}
          className="outline-none min-h-[80px] text-foreground"
          spellCheck
        />
      </Slate>
    </div>
  );
}
