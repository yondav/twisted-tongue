import type {
  ApiFailure,
  Nullable,
  TwisterQueryParams,
  TwisterResponse,
} from '@repo/types';
import { createContext, type ReactNode } from 'react';

import { noopAsync, type ApiStatus } from '@/contexts/initializer';

export type TwisterStatus = ApiStatus | 'idle';

export interface TwisterProviderState {
  status: TwisterStatus;
  data: Nullable<TwisterResponse>;
  error: Nullable<ApiFailure['error']>;
  lastParams: Nullable<TwisterQueryParams>;
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
  generateTwister: noopAsync,
  retry: noopAsync,
};

export const TwisterProviderContext =
  createContext<TwisterProviderState>(initialState);
