import { Router } from 'express';

import {
  getPlaceholderTwister,
  tokenizeTwister,
  validateTwisterParams,
} from '../lib';
import type { ApiResponse, TwisterResponse } from '../types';

const router = Router();

router.get('/', (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const validation = validateTwisterParams({
    theme: req.query.theme as string | undefined,
    difficulty: req.query.difficulty as string | undefined,
    length: req.query.length as string | undefined,
  });

  if (!validation.ok) {
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

  const { theme } = validation.value;
  const twister = getPlaceholderTwister(validation.value);

  const response: ApiResponse<TwisterResponse> = {
    success: true,
    data: {
      id: `twister_${Date.now()}`,
      theme,
      twister,
      tokens: tokenizeTwister(twister),
      createdAt: new Date().toISOString(),
      provider: 'placeholder',
    },
    requestId,
  };

  return res.status(200).json(response);
});

export default router;
