import type {
  Difficulty,
  GeneralLengthConstraint,
  PromptInputs,
  PromptSpec,
  StrictLengthConstraint,
} from '../types/types.prompt';

export const PROMPT_SPEC: PromptSpec = {
  system:
    'You generate tongue twisters. Follow the constraints exactly. Output only the twister text.',
  task: 'Generate a tongue twister based on the provided theme.',
  constraints: {
    sentences: { min: 1, max: 2 },
    words: { min: 8, max: 12 },
    alliteration: true,
    safeLanguage: true,
    outputOnly: true,
  },
};

const lengthToWordRange: Record<
  GeneralLengthConstraint,
  StrictLengthConstraint
> = {
  short: { min: 4, max: 8 },
  medium: { min: 8, max: 12 },
  long: { min: 12, max: 16 },
};

const difficultyInstructions: Record<Difficulty, string> = {
  easy: 'Use simple words and gentle alliteration that is still twister-like.',
  medium: 'Use moderate alliteration with clear, readable words.',
  hard: 'Use strong alliteration and tricky consonant clusters.',
  expert: 'Maximize alliteration with dense, challenging consonant patterns.',
};

export const renderPrompt = (
  spec: PromptSpec,
  inputs: PromptInputs
): string => {
  const { theme, difficulty, length } = inputs;
  const {
    system,
    task,
    constraints: { alliteration, safeLanguage, sentences, outputOnly },
  } = spec;

  const lengthConstraint = lengthToWordRange[length];
  const difficultyLine = difficultyInstructions[difficulty];

  return [
    system,
    '',
    task,
    `Theme: ${theme}.`,
    `Difficulty: ${difficulty}.`,
    `Length: ${length}.`,
    difficultyLine,
    '',
    'Constraints:',
    `- ${sentences.min}-${sentences.max} sentences`,
    `- ${lengthConstraint.min}-${lengthConstraint.max} words`,
    alliteration ? '- Strong alliteration' : '',
    safeLanguage ? '- Safe language only' : '',
    outputOnly ? '- Output only the twister text' : '',
    'Do not add commentary, quotes, or lists.',
  ]
    .filter(Boolean)
    .join('\n');
};
