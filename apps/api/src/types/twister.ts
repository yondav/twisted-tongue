/** PRIMITIVES / SHARED */
export type Nullable<T> = T | null;

/** INPUT DOMAIN */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type LengthPreset = 'short' | 'medium' | 'long';
export type LengthRange = { [key in 'min' | 'max']: number };

// Query params for /twister
export interface TwisterQueryParams {
  provider?: ProviderName;
  theme?: string;
  difficulty?: string;
  length?: string;
}

/** PROMPT CONFIG */
export interface PromptConstraints {
  sentences: LengthRange;
  words: LengthRange;
  alliteration: boolean;
  safeLanguage: boolean;
  outputOnly: boolean; // no filler
}

export interface PromptInputs {
  theme: string;
  difficulty: Difficulty;
  length: LengthPreset;
}

// Static prompt config
export interface PromptSpec {
  system: string;
  task: string;
  constraints: PromptConstraints;
}

/** PROVIDER DOMAIN */
export type ProviderName = 'openai' | 'mock';

export type ProviderUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

// Provider output, internal
export type ProviderTwisterResult = {
  twister: string;
  provider: ProviderName;
  model?: string;
  usage?: ProviderUsage;
};

/** API RESPONSE */
export type ApiErrorCode =
  | 'INVALID_THEME'
  | 'INVALID_DIFFICULTY'
  | 'INVALID_LENGTH'
  | 'PROVIDER_FAILURE'
  | 'INTERNAL_ERROR';

// API payload
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

export interface TwisterErrorResponse {
  code: ApiErrorCode;
  message: string;
}

/** VALIDATION */
export type ValidationSuccess = {
  ok: true;
  value: {
    theme: string;
    difficulty: Difficulty;
    length: LengthPreset;
  };
};

export type ValidationFailure = {
  ok: false;
  code: ApiErrorCode;
  message: string;
};

// Input validation union
export type ValidationResult = ValidationSuccess | ValidationFailure;

// Type guard for validation failures
export const isValidationFailure = (
  result: ValidationResult
): result is ValidationFailure => !result.ok;
