import type {
  Difficulty,
  GeneralLengthConstraint as Length,
  ValidationResult,
} from '../types';

const DIFFICULTIES: Difficulty[] = [
  'easy',
  'medium',
  'hard',
  'expert',
] as const;

const LENGTHS: Length[] = ['short', 'medium', 'long'] as const;

export const validateTwisterParams = (params: {
  theme?: string;
  difficulty?: string;
  length?: string;
}): ValidationResult => {
  const theme = params.theme?.trim() ?? '';

  if (theme.length < 2 || theme.length > 40)
    return {
      ok: false,
      code: 'INVALID_THEME',
      message: 'Theme must be 2-40 characters',
    };

  if (!DIFFICULTIES.includes(params.difficulty as Difficulty))
    return {
      ok: false,
      code: 'INVALID_DIFFICULTY',
      message: 'Invalid difficulty',
    };

  if (!LENGTHS.includes(params.length as Length))
    return {
      ok: false,
      code: 'INVALID_LENGTH',
      message: 'Invalid length',
    };

  return {
    ok: true,
    value: {
      theme,
      difficulty: params.difficulty as Difficulty,
      length: params.length as Length,
    },
  };
};
