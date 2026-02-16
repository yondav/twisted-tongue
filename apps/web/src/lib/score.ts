import type { Difficulty, LengthPreset, Nullable } from '@repo/types';

import type { ScoreBreakdown } from '@/contexts/twister/context';

export type ScoreInputs = {
  accuracyPercent: Nullable<number>;
  timeSeconds: Nullable<number>;
  difficulty: Nullable<Difficulty>;
  length: Nullable<LengthPreset>;
  wordCount: Nullable<number>;
};

const secondsPerWord: Record<Difficulty, number> = {
  easy: 0.45,
  medium: 0.55,
  hard: 0.65,
  expert: 0.75,
};

const clamp = (min: number, max: number, value: number) =>
  Math.min(max, Math.max(min, value));

export function calculateScoreBreakdown(
  inputs: ScoreInputs
): Nullable<ScoreBreakdown> {
  const { accuracyPercent, timeSeconds, difficulty, length, wordCount } =
    inputs;

  if (
    accuracyPercent === null ||
    timeSeconds === null ||
    !difficulty ||
    !length ||
    !wordCount ||
    wordCount <= 0
  )
    return null;

  const accuracyFactor = clamp(0, 1, accuracyPercent / 100);

  const expectedTime = wordCount * secondsPerWord[difficulty];
  const timeFactor = clamp(
    0.6,
    1.05,
    Math.pow(expectedTime / timeSeconds, 0.7)
  );

  const difficultyFactor = 1;
  const lengthFactor = 1;

  const rawScore = 100 * Math.pow(accuracyFactor, 1.2) * timeFactor;

  const score =
    accuracyPercent > 50
      ? Math.round(clamp(0, 100, rawScore) + (expectedTime - timeSeconds) / 3.7)
      : Math.round(
          clamp(0, 100, rawScore) - (expectedTime - timeSeconds) / 3.7
        );

  return {
    score: accuracyPercent <= 0 ? 0 : score > 100 ? 100 : score,
    accuracyFactor,
    timeSeconds,
    expectedTime,
    timeFactor,
    difficultyFactor,
    lengthFactor,
    wordCount,
  };
}
