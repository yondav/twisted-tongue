import type { ProviderName, Nullable } from '@repo/types';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { readyQuery } from '@/lib/queries';

import {
  InitializerProviderContext,
  type ApiError,
  type ApiStatus,
  type InitializerProviderProps,
  type InitializerProviderState,
  type MicError,
  type MicStatus,
} from './context';

export function InitializerProvider({ children }: InitializerProviderProps) {
  const { data, isError, error, refetch, status } = useQuery(readyQuery);

  const [micStatus, setMicStatus] = useState<MicStatus>('pending');
  const [micError, setMicError] = useState<Nullable<MicError>>(null);
  const [provider, setProvider] = useState<ProviderName>('openai');

  // For the sake of simplicity, we don't need to consider the nuances in the various values returned from useQuery to narrow the status of initialization.
  const apiStatus: ApiStatus = useMemo(() => {
    if (status === 'success' || status === 'error') return status;
    return 'pending';
  }, [status]);

  const apiError: Nullable<ApiError> = useMemo(() => {
    if (data?.success) return null;

    if (data?.error) return data.error;

    if (isError)
      return {
        code: 'NETWORK',
        message: error instanceof Error ? error.message : 'Network error',
      };

    if (!data?.success && !data?.error)
      return {
        code: 'UNKNOWN',
        message: 'Unknown error',
      };

    return null;
  }, [data, error, isError]);

  const checkApi = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const checkMic = useCallback(async () => {
    setMicStatus('pending');
    setMicError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus('error');
      setMicError({
        code: 'NOT_SUPPORTED',
        message: 'Microphone access is not supported in this browser.',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicStatus('granted');
    } catch (err) {
      const errorName = err instanceof Error ? err.name : '';
      setMicStatus('denied');
      setMicError({
        code: errorName === 'NotAllowedError' ? 'PERMISSION_DENIED' : 'UNKNOWN',
        message:
          err instanceof Error ? err.message : 'Microphone permission denied.',
      });
    }
  }, []);

  const value: InitializerProviderState = useMemo(
    () => ({
      api: {
        status: apiStatus,
        error: apiError,
        lastCheckedAt: new Date().toISOString(),
      },
      mic: {
        status: micStatus,
        error: micError,
        quality: null,
      },
      canProceed: apiStatus === 'success' && micStatus === 'granted',
      provider,
      checkApi,
      checkMic,
      setProvider,
    }),
    [apiError, apiStatus, checkApi, checkMic, micError, micStatus, provider]
  );

  return (
    <InitializerProviderContext.Provider value={value}>
      {children}
    </InitializerProviderContext.Provider>
  );
}
