import type {
  ApiErrorCode,
  Difficulty,
  LengthPreset,
  ProviderName,
  ProviderUsage,
} from '@repo/types';
/** INPUT DOMAIN */
export type LengthRange = { [key in 'min' | 'max']: number };

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
// Provider output, internal
export type ProviderTwisterResult = {
  twister: string;
  provider: ProviderName;
  model?: string;
  usage?: ProviderUsage;
};

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
