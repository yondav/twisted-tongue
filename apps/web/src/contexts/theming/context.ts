import { createContext, type ReactNode } from 'react';

export type Mode = 'dark' | 'light' | 'system';
export type Theme = 'studio' | 'signal' | 'midnight' | 'paper';

export const themeOptions: { id: Theme; label: string }[] = [
  { id: 'studio', label: 'Studio Tool' },
  { id: 'signal', label: 'Signal Orange' },
  { id: 'midnight', label: 'Glacier Blue' },
  { id: 'paper', label: 'Paper & Ink' },
];

export const modeOptions: { id: Mode; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

export interface ThemingProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultMode?: Mode;
  themeStorageKey?: string;
  modeStorageKey?: string;
}

export interface ThemingProviderState {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
}

const initialState: ThemingProviderState = {
  theme: 'studio',
  mode: 'system',
  setTheme: () => null,
  setMode: () => null,
};

export const ThemingProviderContext =
  createContext<ThemingProviderState>(initialState);
