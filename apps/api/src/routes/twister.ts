import { Router } from 'express';

import {
  getProvider,
  PROMPT_SPEC,
  renderPrompt,
  tokenizeTwister,
  validateTwisterParams,
} from '../lib';
import {
  isValidationFailure,
  type ApiResponse,
  type TwisterResponse,
} from '../types';

const router = Router();

router.get('/', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const validation = validateTwisterParams({
    theme: req.query.theme as string | undefined,
    difficulty: req.query.difficulty as string | undefined,
    length: req.query.length as string | undefined,
  });

  if (isValidationFailure(validation)) {
    const response: ApiResponse<TwisterResponse> = {
      success: false,
      error: {
        code: validation.code,
        message: validation.message,
        requestId,
      },
      requestId,
    };

    return res.status(400).json(response);
  }

  const prompt = renderPrompt(PROMPT_SPEC, validation.value);
  const provider = getProvider();
  const { twister, provider: providerName } = await provider.generateTwister(
    validation.value,
    prompt
  );

  const { theme } = validation.value;

  const response: ApiResponse<TwisterResponse> = {
    success: true,
    data: {
      id: `twister_${Date.now()}`,
      theme,
      twister,
      tokens: tokenizeTwister(twister),
      createdAt: new Date().toISOString(),
      provider: providerName,
    },
    requestId,
  };

  return res.status(200).json(response);
});

export default router;
