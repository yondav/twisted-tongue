export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type LengthPreset = 'short' | 'medium' | 'long';

export type ProviderName = 'openai' | 'mock';

export type ProviderUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export type ApiErrorCode =
  | 'INVALID_THEME'
  | 'INVALID_DIFFICULTY'
  | 'INVALID_LENGTH'
  | 'PROVIDER_FAILURE'
  | 'INTERNAL_ERROR';

export interface TwisterErrorResponse {
  code: ApiErrorCode;
  message: string;
}

export interface TwisterResponse {
  id: string;
  theme: string;
  twister: string;
  tokens: string[];
  createdAt: string;
  provider: ProviderName;
  model?: string;
  usage?: ProviderUsage;
}

export interface TwisterQueryParams {
  provider?: ProviderName;
  theme?: string;
  difficulty?: string;
  length?: string;
}

export type ApiSuccess<T> = {
  success: true;
  message: string;
  requestId: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  requestId: string;
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
