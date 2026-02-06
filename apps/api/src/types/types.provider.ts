import type { PromptInputs } from './types.prompt';

export type ProviderName = 'openai' | 'anthropic' | 'mock';

export type ProviderUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export type TwisterResult = {
  twister: string;
  provider: ProviderName;
  usage?: ProviderUsage;
};

export interface TwisterProvider {
  generateTwister(inputs: PromptInputs, prompt: string): Promise<TwisterResult>;
}
