import type { ApiErrorCode, Nullable, ProviderName } from '@repo/types';
import { createContext, type ReactNode } from 'react';

export type BaseStatus = 'pending' | 'error';
export type ApiStatus = BaseStatus | 'success';
export type MicStatus = BaseStatus | 'granted' | 'denied';

export interface ApiError {
  code: ApiErrorCode | 'NETWORK' | 'UNKNOWN';
  message: string;
}

export interface MicError {
  code: 'PERMISSION_DENIED' | 'NO_DEVICE' | 'NOT_SUPPORTED' | 'UNKNOWN';
  message: string;
}

export interface AudioQuality {
  level: number;
  peak: number;
  noiseFloor: number;
  verdict: 'ok' | 'low' | 'noisy';
}

export interface InitializerProviderState {
  api: {
    status: ApiStatus;
    error?: Nullable<ApiError>;
    lastCheckedAt?: string;
  };
  mic: {
    status: MicStatus;
    error?: Nullable<MicError>;
    quality?: Nullable<AudioQuality>;
  };
  canProceed: boolean;
  provider: ProviderName;

  checkApi: () => Promise<void>;
  checkMic: () => Promise<void>;
  setProvider: (provider: ProviderName) => void;
}

export interface InitializerProviderProps {
  children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const noopAsync = async () => undefined;

const initialState: InitializerProviderState = {
  api: { status: 'pending', error: null },
  mic: { status: 'pending', error: null, quality: null },
  canProceed: false,
  provider: 'openai',
  checkApi: noopAsync,
  checkMic: noopAsync,
  setProvider: () => null,
};

export const InitializerProviderContext =
  createContext<InitializerProviderState>(initialState);
