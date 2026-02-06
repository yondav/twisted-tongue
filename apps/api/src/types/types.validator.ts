import type {
  Difficulty,
  GeneralLengthConstraint as Length,
} from './types.prompt';
import type { ApiErrorCode } from './types.response';

export type ValidationSuccess = {
  ok: true;
  value: {
    theme: string;
    difficulty: Difficulty;
    length: Length;
  };
};

export type ValidationFailure = {
  ok: false;
  code: ApiErrorCode;
  message: string;
};

export type ValidationResult = ValidationSuccess | ValidationFailure;

export const isValidationFailure = (
  result: ValidationResult
): result is ValidationFailure => !result.ok;
