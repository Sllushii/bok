import { Category } from './types';

export const CATEGORIES: Record<Category, { label: string; emoji: string; color: string }> = {
  'fresh-produce': { label: 'Fresh Produce', emoji: '🥬', color: '#16a34a' },
  'meat-seafood':  { label: 'Meat & Seafood', emoji: '🥩', color: '#dc2626' },
  'pantry':        { label: 'Pantry',          emoji: '🫙', color: '#ca8a04' },
  'frozen':        { label: 'Frozen',           emoji: '🧊', color: '#2563eb' },
  'snacks':        { label: 'Snacks',           emoji: '🍜', color: '#9333ea' },
  'drinks':        { label: 'Drinks',           emoji: '🧃', color: '#0891b2' },
  'other':         { label: 'Other',            emoji: '🛒', color: '#78716c' },
};

export const CUISINE_COLORS: Record<string, string> = {
  chinese:    '#dc2626',
  vietnamese: '#ea580c',
  korean:     '#2563eb',
  japanese:   '#db2777',
  'pan-asian': '#16a34a',
};
