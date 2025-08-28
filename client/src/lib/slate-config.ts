import { createEditor, Descendant } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';

export const createSlateEditor = () => withHistory(withReact(createEditor()));

export const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const serialize = (nodes: Descendant[]): string => {
  return nodes
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
};

export const deserialize = (text: string): Descendant[] => {
  if (!text) return initialValue;
  
  const lines = text.split('\n');
  return lines.map(line => ({
    type: 'paragraph',
    children: [{ text: line }],
  }));
};
