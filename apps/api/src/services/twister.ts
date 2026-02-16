import type {
  Difficulty,
  LengthPreset as Length,
  ProviderName,
  Nullable,
  TwisterErrorResponse,
  TwisterResponse,
  TwisterQueryParams,
} from '@repo/types';
import OpenAI from 'openai';

import {
  OPENAI_API_KEY,
  DIFFICULTIES,
  LENGTHS,
  MOCK_TWISTERS,
  PROMPT_SPEC,
  LENGTH_WORD_RANGE,
  DIFFICULTY_INSTRUCTIONS,
} from '../lib';
import {
  isValidationFailure,
  type PromptSpec,
  type PromptInputs,
  type ProviderTwisterResult,
  type ValidationResult,
} from '../types';

import { ResponseService } from './response';

const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Orchestrates the full twister generation flow.
 * Validates inputs, selects provider, generates output, and shapes responses.
 */
export class TwisterService {
  private static normalizeTheme(theme?: string): string {
    return (theme ?? '').trim().toLowerCase();
  }

  /**
   * Handles supported theme values for mock data.
   * Mock data should be treated as a fallback with limited theme options if openai fails for any reason.
   */
  private static resolveMockThemeKey(
    theme: string
  ): Nullable<keyof typeof MOCK_TWISTERS> {
    const keys = Object.keys(MOCK_TWISTERS) as (keyof typeof MOCK_TWISTERS)[];
    const match = keys.find(key => theme.includes(key));

    return match ?? null;
  }

  /**
   * Assumes that provider is openai by default.
   */
  private static normalizeProvider(provider?: ProviderName): ProviderName {
    return provider ?? 'openai';
  }

  /**
   * Assembles typed validation response for query params.
   */
  private static validateInputs(params: TwisterQueryParams): ValidationResult {
    const theme = this.normalizeTheme(params.theme);

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
  }

  /**
   * Validates word count of generated twister is aligned with registered length constraints.
   */
  private static validateWordCount(text: string, length: Length): boolean {
    const range = LENGTH_WORD_RANGE[length];
    const wordCount = this.tokenizeTwister(text).length;

    return wordCount >= range.min && wordCount <= range.max;
  }

  /**
   * Formats twister if LLM response generates with quotes.
   */
  private static trimTwister(text: string): string {
    const trimmed = text.trim();

    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    )
      return trimmed.slice(1, -1).trim();

    return trimmed;
  }

  /**
   * Breaks twister into list of individual word tokens.
   */
  private static tokenizeTwister(text: string): string[] {
    const edgePunctuation = /^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g;

    return text
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .map(word => word.replace(edgePunctuation, ''))
      .filter(Boolean);
  }

  /**
   * Constructs complete prompt for LLM to generate twister.
   */
  private static renderPrompt(spec: PromptSpec, inputs: PromptInputs): string {
    const { theme, difficulty, length } = inputs;
    const { system, task, constraints } = spec;

    const lengthConstraint = LENGTH_WORD_RANGE[length];
    const difficultyLine = DIFFICULTY_INSTRUCTIONS[difficulty];

    const { alliteration, outputOnly, safeLanguage, sentences } = constraints;

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
  }

  /**
   * Constructs typed response with the twister generated either by LLM or by mock.
   */
  private static buildResponse(
    inputs: PromptInputs,
    result: ProviderTwisterResult
  ): TwisterResponse {
    const trimmedTwister = this.trimTwister(result.twister);

    return {
      id: `twister_${Date.now()}`,
      theme: inputs.theme,
      twister: trimmedTwister,
      tokens: this.tokenizeTwister(trimmedTwister),
      createdAt: new Date().toISOString(),
      provider: result.provider,
      model: result.model,
      usage: result.usage,
    };
  }

  /**
   * Generate twister from mock data
   */
  private static async generateMock(
    inputs: PromptInputs,
    mockThemeKey: keyof typeof MOCK_TWISTERS
  ): Promise<ProviderTwisterResult> {
    return Promise.resolve({
      twister: MOCK_TWISTERS[mockThemeKey][inputs.length][inputs.difficulty],
      provider: 'mock',
    });
  }

  /**
   * Generate twister with openai SDK
   */
  private static async generateOpenAi(
    inputs: PromptInputs
  ): Promise<ProviderTwisterResult> {
    const prompt = this.renderPrompt(PROMPT_SPEC, inputs);

    const response = await openaiClient.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.8, // more random
    });

    const twister = response.output_text ?? '';

    if (!twister || !this.validateWordCount(twister, inputs.length))
      throw new Error('Invalid LLM output');

    const usage = response.usage
      ? {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          totalTokens: response.usage.total_tokens,
        }
      : undefined;

    return {
      twister,
      provider: 'openai',
      model: 'gpt-4o-mini',
      usage,
    };
  }

  /**
   * Entry point used by routes. Returns a ResponseService-shaped payload
   * along with the status code to send in the controller.
   */
  public static async generate(params: TwisterQueryParams) {
    const provider = this.normalizeProvider(params.provider);
    const validation = this.validateInputs(params);

    if (isValidationFailure(validation)) {
      const { statusCode, ...response } =
        ResponseService.failure<TwisterErrorResponse>('Validation error', {
          code: validation.code,
          message: validation.message,
        });

      return { statusCode, response };
    }

    const inputs = validation.value;

    if (provider === 'mock') {
      const mockThemeKey = this.resolveMockThemeKey(inputs.theme);

      // Validate theme value received in query param
      if (!mockThemeKey) {
        const { statusCode, ...response } =
          ResponseService.failure<TwisterErrorResponse>(
            'Unsupported mock theme',
            {
              code: 'INVALID_THEME',
              message:
                'Available mock themes: sea, cooking, space, music, sports, animals',
            }
          );

        return { statusCode, response };
      }

      const result = await this.generateMock(inputs, mockThemeKey);
      const { statusCode, ...response } = ResponseService.success(
        'Twister generated',
        this.buildResponse(inputs, result)
      );

      return { statusCode, response };
    }

    // Account for missing api key
    if (!OPENAI_API_KEY) {
      const { statusCode, ...response } =
        ResponseService.failure<TwisterErrorResponse>(
          'Provider error',
          {
            code: 'PROVIDER_FAILURE',
            message: 'Missing OPENAI_API_KEY',
          },
          500
        );

      return { statusCode, response };
    }

    try {
      const result = await this.generateOpenAi(inputs);
      const { statusCode, ...response } = ResponseService.success(
        'Twister generated',
        this.buildResponse(inputs, result)
      );

      return { statusCode, response };
    } catch (err) {
      const { statusCode, ...response } =
        ResponseService.failure<TwisterErrorResponse>(
          'Provider error',
          {
            code: 'PROVIDER_FAILURE',
            message:
              err instanceof Error ? err.message : 'Unknown provider error',
          },
          500
        );

      return { statusCode, response };
    }
  }
}
