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

export interface ScoreBreakdown {
  score: number;
  accuracyFactor: number;
  timeSeconds: number;
  expectedTime: number;
  timeFactor: number;
  difficultyFactor: number;
  lengthFactor: number;
  wordCount: number;
}

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

export interface MetricsContext {
  time: Nullable<number>;
  accuracy: Nullable<number>;
  scoreBreakdown: Nullable<ScoreBreakdown>;
}

export interface GamePlayContext {
  speech: SpeechContext;
  transcript: TranscriptContext;
  metrics: MetricsContext;
  startListening: () => void;
  stopListening: () => void;
  resetListening: () => void;
  setTime: (seconds: Nullable<number>) => void;
  setAccuracy: (accuracy: Nullable<number>) => void;
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
    metrics: {
      accuracy: null,
      time: null,
      scoreBreakdown: null,
    },
    startListening: () => null,
    stopListening: () => null,
    resetListening: () => null,
    setAccuracy: () => null,
    setTime: () => null,
  },
  generateTwister: noopAsync,
  retry: noopAsync,
};

export const TwisterProviderContext =
  createContext<TwisterProviderState>(initialState);
