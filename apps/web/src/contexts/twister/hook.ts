import { useContext } from 'react';

import { TwisterProviderContext } from './context';

export function useTwister() {
  const ctx = useContext(TwisterProviderContext);

  if (!ctx)
    throw new Error(
      'Initializer context can only operated from within its provider'
    );

  return ctx;
}
