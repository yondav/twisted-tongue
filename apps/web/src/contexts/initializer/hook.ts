import { useContext } from 'react';

import { InitializerProviderContext } from './context';

export function useInitializer() {
  const ctx = useContext(InitializerProviderContext);

  if (!ctx)
    throw new Error(
      'Initializer context can only operated from within its provider'
    );

  return ctx;
}
