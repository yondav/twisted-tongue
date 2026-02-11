import { useContext } from 'react';

import { ThemingProviderContext } from './context';

export function useTheming() {
  const ctx = useContext(ThemingProviderContext);

  if (!ctx)
    throw new Error(
      'Theming context can only operated from within its provider'
    );

  return ctx;
}
