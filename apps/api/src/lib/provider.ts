import type { ProviderName, PromptInputs, TwisterProvider } from '../types';

import { getPlaceholderTwister } from './placeholderTwisters';

const toProviderName = (value: string | undefined): ProviderName => {
  if (value === 'openai') return 'openai';
  if (value === 'anthropic') return 'anthropic';
  return 'mock';
};

const mockProvider: TwisterProvider = {
  generateTwister: async (
    inputs: PromptInputs,
    _prompt: string
  ): Promise<{ twister: string; provider: ProviderName }> => ({
    twister: getPlaceholderTwister(inputs),
    provider: 'mock',
  }),
};

const openAiProvider: TwisterProvider = {
  generateTwister: async (
    _inputs: PromptInputs,
    _prompt: string
  ): Promise<{ twister: string; provider: ProviderName }> => {
    throw new Error('OpenAI provider not implemented yet.');
  },
};

const anthropicProvider: TwisterProvider = {
  generateTwister: async (
    _inputs: PromptInputs,
    _prompt: string
  ): Promise<{ twister: string; provider: ProviderName }> => {
    throw new Error('Anthropic provider not implemented yet.');
  },
};

export const getProviderName = (): ProviderName =>
  toProviderName(process.env.LLM_PROVIDER);

export const getProvider = (): TwisterProvider => {
  const providerName = getProviderName();

  const registry: Record<ProviderName, TwisterProvider> = {
    openai: openAiProvider,
    anthropic: anthropicProvider,
    mock: mockProvider,
  };

  return registry[providerName];
};
