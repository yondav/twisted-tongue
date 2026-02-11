import type { Difficulty, LengthPreset } from '@repo/types';

import type { LengthRange, PromptSpec } from '../types';

/** RUNTIME CONFIG */
// Runtime config: API key from env
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
export const PORT = process.env.PORT;
export const CLIENT_URL = process.env.CLIENT_URL;

/** ENUMS / PRESETS */
export const DIFFICULTIES: Difficulty[] = [
  'easy',
  'medium',
  'hard',
  'expert',
] as const;

export const LENGTHS: LengthPreset[] = ['short', 'medium', 'long'] as const;

/** PROMPT CONFIG */
// Prompt template used for LLM generation
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
} as const;

// Mapping between ui length presets and word count
export const LENGTH_WORD_RANGE: Record<LengthPreset, LengthRange> = {
  short: { min: 4, max: 8 },
  medium: { min: 8, max: 12 },
  long: { min: 12, max: 16 },
} as const;

// Instructions for difficulty of twister appended to prompt
export const DIFFICULTY_INSTRUCTIONS: Record<Difficulty, string> = {
  easy: 'Use simple words and gentle alliteration that is still twister-like.',
  medium: 'Use moderate alliteration with clear, readable words.',
  hard: 'Use strong alliteration and tricky consonant clusters.',
  expert: 'Maximize alliteration with dense, challenging consonant patterns.',
} as const;

/** MOCK DATA */
// Mock data only - limited themes
export const MOCK_TWISTERS: Record<
  'sea' | 'cooking' | 'space' | 'music' | 'sports' | 'animals',
  Record<LengthPreset, Record<Difficulty, string>>
> = {
  sea: {
    short: {
      easy: 'Sly sea slugs slide softly.',
      medium: 'Sleek sea seals slide swiftly.',
      hard: 'Swift sea swans swish, slosh.',
      expert: 'Seething sea swans swiftly swish, slosh.',
    },
    medium: {
      easy: 'Slick sea slugs slide swiftly by salty shores.',
      medium: 'Sleek sea seals slide past salty shoals steadily.',
      hard: 'Stormy sea swans swirl, splashing slick shells and shoals.',
      expert: 'Stormy sea swans swirl, splashing slick shells, shoals, skiffs.',
    },
    long: {
      easy: 'Slick sea slugs slide swiftly by salty shores, seeking shiny shells today.',
      medium:
        'Sleek sea seals slide past salty shoals, seeking smooth stones nearby today.',
      hard: 'Stormy sea swans swirl, splashing slick shells and shoals while sailors steer.',
      expert:
        'Stormy sea swans swirl, splashing slick shells, shoals, skiffs while sailors steer.',
    },
  },
  cooking: {
    short: {
      easy: 'Silly chefs chop chili.',
      medium: 'Clever chefs chop chili quickly.',
      hard: 'Crisp crusts crack, clatter, crumble.',
      expert: 'Crisp crusts crackle, clatter, crumble.',
    },
    medium: {
      easy: 'Clever cooks cut carrots, coat pans, and stir steadily.',
      medium: 'Clever cooks cut carrots, coat pans, stir steadily.',
      hard: 'Crisp crusts crackle as crafty chefs chop charred chiles.',
      expert:
        'Crisp crusts crackle as crafty chefs chop charred chiles quickly.',
    },
    long: {
      easy: 'Clever cooks cut carrots, coat pans, and stir stews for supper slowly.',
      medium:
        'Clever cooks cut carrots, coat pans, stir stews for supper slowly today.',
      hard: 'Crisp crusts crackle as crafty chefs chop charred chiles with clattering knives.',
      expert:
        'Crisp crusts crackle as crafty chefs chop charred chiles with clattering, clinking knives.',
    },
  },
  space: {
    short: {
      easy: 'Starry skies spin slowly.',
      medium: 'Starry ships spin silently.',
      hard: 'Spaced ships shift, shimmer, shudder.',
      expert: 'Spaced ships shift, shimmer, shudder sharply.',
    },
    medium: {
      easy: 'Silent star sailors steer silver ships through soft starlight.',
      medium:
        'Silent star sailors steer silver ships through steady starlight.',
      hard: 'Spaced pilots spin past spirals, skimming swift stellar streams.',
      expert:
        'Spaced pilots spin past spirals, skimming swift stellar streams swiftly.',
    },
    long: {
      easy: 'Silent star sailors steer silver ships through soft starlight and steady streams.',
      medium:
        'Silent star sailors steer silver ships through steady starlight and streaming skies.',
      hard: 'Spaced pilots spin past spirals, skimming swift stellar streams and shadowy stations.',
      expert:
        'Spaced pilots spin past spirals, skimming swift stellar streams and shadowy stations swiftly.',
    },
  },
  music: {
    short: {
      easy: 'Merry melodies move minds.',
      medium: 'Mellow melodies move minds.',
      hard: 'Sharp strings strike, shimmer, sing.',
      expert: 'Sharp strings strike, shimmer, sing sharply.',
    },
    medium: {
      easy: 'Mellow musicians make merry melodies, moving many minds.',
      medium: 'Mellow musicians make mellow melodies, moving many minds.',
      hard: 'Sharp strings strike, shimmering scales skip swiftly through silent halls.',
      expert:
        'Sharp strings strike, shimmering scales skip swiftly through silent halls, singing.',
    },
    long: {
      easy: 'Mellow musicians make merry melodies, moving many minds with measured beats today.',
      medium:
        'Mellow musicians make mellow melodies, moving many minds with measured beats today.',
      hard: 'Sharp strings strike, shimmering scales skip swiftly through silent halls and stages.',
      expert:
        'Sharp strings strike, shimmering scales skip swiftly through silent halls and stages, singing.',
    },
  },
  sports: {
    short: {
      easy: 'Swift strikers score smoothly.',
      medium: 'Swift strikers sprint smoothly.',
      hard: 'Stout sprinters stretch, sprint, surge.',
      expert: 'Stout sprinters stretch, sprint, surge swiftly.',
    },
    medium: {
      easy: 'Swift strikers sprint, score, and celebrate smooth victories.',
      medium: 'Swift strikers sprint, score, and celebrate steady victories.',
      hard: 'Stout sprinters stretch, sprint, and surge past stubborn starters.',
      expert:
        'Stout sprinters stretch, sprint, and surge past stubborn starters swiftly.',
    },
    long: {
      easy: 'Swift strikers sprint, score, and celebrate smooth victories with steady stamina today.',
      medium:
        'Swift strikers sprint, score, and celebrate steady victories with steady stamina today.',
      hard: 'Stout sprinters stretch, sprint, and surge past stubborn starters and stiff stadium steps.',
      expert:
        'Stout sprinters stretch, sprint, and surge past stubborn starters and stiff stadium steps swiftly.',
    },
  },
  animals: {
    short: {
      easy: 'Fuzzy foxes frisk fast.',
      medium: 'Fuzzy foxes frisk freely.',
      hard: 'Bristled bears bellow, bound, bash.',
      expert: 'Bristled bears bellow, bound, bash boldly.',
    },
    medium: {
      easy: 'Fuzzy foxes flutter through fields, following friendly fawns.',
      medium:
        'Fuzzy foxes flutter through fields, following friendly forest friends.',
      hard: 'Bristled bears bellow, bounding boldly beyond broken branches.',
      expert:
        'Bristled bears bellow, bounding boldly beyond broken branches and brambles.',
    },
    long: {
      easy: 'Fuzzy foxes flutter through fields, following friendly fawns and feisty ferrets nearby.',
      medium:
        'Fuzzy foxes flutter through fields, following friendly forest friends and feisty ferrets nearby.',
      hard: 'Bristled bears bellow, bounding boldly beyond broken branches and bristly bushes today.',
      expert:
        'Bristled bears bellow, bounding boldly beyond broken branches and bristly bushes by brookbanks.',
    },
  },
} as const;
