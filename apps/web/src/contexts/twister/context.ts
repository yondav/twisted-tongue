import type {
  ApiFailure,
  Nullable,
  TwisterQueryParams,
  TwisterResponse,
} from '@repo/types';
import { createContext, type ReactNode } from 'react';

import { noopAsync, type ApiStatus } from '@/contexts/initializer';

export type TwisterStatus = ApiStatus | 'idle';
export type ListeningStatus = 'idle' | 'listening' | 'stopped' | 'error';

export interface SpeechContext {
  status: ListeningStatus;
  error: Nullable<string>;
  isListening: boolean;
  lastUpdateAt: Nullable<number>;
}

export interface TranscriptContext {
  interim: string;
  final: string;
}

export interface GamePlayContext {
  speech: SpeechContext;
  transcript: TranscriptContext;
  startListening: () => void;
  stopListening: () => void;
  resetListening: () => void;
}

export interface TwisterProviderState {
  status: TwisterStatus;
  data: Nullable<TwisterResponse>;
  error: Nullable<ApiFailure['error']>;
  lastParams: Nullable<TwisterQueryParams>;
  gamePlay: GamePlayContext;
  generateTwister: (params: TwisterQueryParams) => Promise<void>;
  retry: () => Promise<void>;
}

export interface TwisterProviderProps {
  children: ReactNode;
}

const initialState: TwisterProviderState = {
  status: 'idle',
  data: null,
  error: null,
  lastParams: null,
  gamePlay: {
    speech: {
      status: 'idle',
      error: null,
      isListening: false,
      lastUpdateAt: null,
    },
    transcript: {
      interim: '',
      final: '',
    },
    startListening: () => null,
    stopListening: () => null,
    resetListening: () => null,
  },
  generateTwister: noopAsync,
  retry: noopAsync,
};

export const TwisterProviderContext =
  createContext<TwisterProviderState>(initialState);
