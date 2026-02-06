export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type GeneralLengthConstraint = 'short' | 'medium' | 'long';
export type StrictLengthConstraint = { [key in 'min' | 'max']: number };

export interface PromptConstraints {
  sentences: StrictLengthConstraint;
  words: StrictLengthConstraint;
  alliteration: boolean;
  safeLanguage: boolean;
  outputOnly: boolean; // no filler
}

export interface PromptInputs {
  theme: string;
  difficulty: Difficulty;
  length: GeneralLengthConstraint;
}

export interface PromptSpec {
  system: string;
  task: string;
  constraints: PromptConstraints;
}
