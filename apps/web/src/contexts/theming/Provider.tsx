import { useCallback, useEffect, useMemo, useState } from 'react';

import { useKeyBinding } from '@/hooks/useKeyBinding';

import {
  ThemingProviderContext,
  type Mode,
  type Theme,
  type ThemingProviderProps,
  type ThemingProviderState,
  modeOptions,
  themeOptions,
} from './context';

export function ThemingProvider({
  defaultMode = 'system',
  defaultTheme = 'studio',
  themeStorageKey = 'twisted-theme',
  modeStorageKey = 'twisted-mode',
  children,
}: ThemingProviderProps) {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  const normalizedTheme = useMemo(() => {
    if (mode === 'system') return systemPref;
    return mode;
  }, [mode, systemPref]);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      const prevTheme = prev === 'system' ? normalizedTheme : prev;

      return prevTheme === 'light' ? 'dark' : 'light';
    });
  }, [normalizedTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const idx = themeOptions.findIndex(t => t.id === prev);
      const safeIdx = idx === -1 ? 0 : idx;
      const nextIdx = (safeIdx + 1) % themeOptions.length;

      return themeOptions[nextIdx]?.id ?? 'studio';
    });
  }, []);

  useKeyBinding(['Shift', 'd', 'D'], toggleMode);
  useKeyBinding(['Shift', 't', 'T'], toggleTheme);

  const isValidMode = useCallback((value: string | null): value is Mode => {
    if (!value) return false;
    return modeOptions.some(option => option.id === value);
  }, []);

  const isValidTheme = useCallback((value: string | null): value is Theme => {
    if (!value) return false;
    return themeOptions.some(option => option.id === value);
  }, []);

  const initializeMode = useCallback(
    (root: HTMLElement) => {
      root.classList.remove('light', 'dark');

      if (mode === 'system') {
        root.classList.add(systemPref);
        return;
      }

      root.classList.add(mode);
    },
    [mode, systemPref]
  );

  const initializeTheme = useCallback(
    (root: HTMLElement) => {
      if (theme === 'studio') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', theme);
    },
    [theme]
  );

  useEffect(() => {
    const storedMode = localStorage.getItem(modeStorageKey);
    const storedTheme = localStorage.getItem(themeStorageKey);

    if (isValidMode(storedMode)) setMode(storedMode);
    if (isValidTheme(storedTheme)) setTheme(storedTheme);

    setHasInitialized(true);
  }, [isValidMode, isValidTheme, modeStorageKey, themeStorageKey]);

  useEffect(() => {
    const root = window.document.documentElement;

    initializeMode(root);
    initializeTheme(root);

    if (hasInitialized) {
      localStorage.setItem(modeStorageKey, mode);
      localStorage.setItem(themeStorageKey, theme);
    }
  }, [
    hasInitialized,
    initializeMode,
    initializeTheme,
    mode,
    theme,
    modeStorageKey,
    themeStorageKey,
  ]);

  const value: ThemingProviderState = useMemo(
    () => ({
      theme,
      mode,
      setTheme,
      setMode,
    }),
    [mode, theme]
  );

  return (
    <ThemingProviderContext.Provider value={value}>
      {children}
    </ThemingProviderContext.Provider>
  );
}
