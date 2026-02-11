import type {
  ApiFailure,
  Nullable,
  TwisterResponse,
  TwisterQueryParams,
} from '@repo/types';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useInitializer } from '@/contexts/initializer';
import { fetchTwister } from '@/lib/queries';

import {
  TwisterProviderContext,
  type TwisterProviderProps,
  type TwisterProviderState,
  type TwisterStatus,
} from './context';

export function TwisterProvider({ children }: TwisterProviderProps) {
  // Provider selection is derived from initializer context
  const { provider } = useInitializer();

  const [status, setStatus] = useState<TwisterStatus>('idle');
  const [data, setData] = useState<Nullable<TwisterResponse>>(null);
  const [error, setError] = useState<Nullable<ApiFailure['error']>>(null);
  const [lastParams, setLastParams] =
    useState<Nullable<TwisterQueryParams>>(null);

  // AbortController allows us to cancel in‑flight requests
  const controllerRef = useRef<Nullable<AbortController>>(null);

  const mutation = useMutation({
    mutationKey: ['twister'],
    mutationFn: ({
      params,
      signal,
    }: {
      params: TwisterQueryParams;
      signal?: AbortSignal;
    }) => fetchTwister(params, signal),
  });

  const generateTwister = useCallback(
    async (params: TwisterQueryParams) => {
      // Cancel any pending request before starting a new one      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      const resolvedParams = {
        ...params,
        provider: params.provider ?? provider,
      };

      setStatus('pending');
      setData(null);
      setError(null);
      setLastParams(resolvedParams);

      try {
        const response = await mutation.mutateAsync({
          params: resolvedParams,
          signal: controllerRef.current?.signal,
        });

        if (response.success) {
          setStatus('success');
          setData(response.data);
        } else {
          setStatus('error');
          setError(response.error);
        }
      } catch (err) {
        // Ignore aborts; treat all other errors as network failures
        if (err instanceof DOMException && err.name === 'AbortError') return;

        setStatus('error');
        setError({
          code: 'INTERNAL_ERROR',
          message: err instanceof Error ? err.message : 'Network error',
        });
      }
    },
    [mutation, provider]
  );

  const retry = useCallback(async () => {
    if (!lastParams) return;
    await generateTwister(lastParams);
  }, [generateTwister, lastParams]);

  const value: TwisterProviderState = useMemo(
    () => ({
      status,
      data,
      error,
      lastParams,
      generateTwister,
      retry,
    }),
    [data, error, generateTwister, lastParams, retry, status]
  );

  return (
    <TwisterProviderContext.Provider value={value}>
      {children}
    </TwisterProviderContext.Provider>
  );
}
