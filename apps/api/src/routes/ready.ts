import { Router } from 'express';

import { OPENAI_API_KEY } from '../lib';
import { ResponseService } from '../services';
import type { TwisterErrorResponse } from '../types';

const router = Router();

router.get('/', (req, res) => {
  if (!OPENAI_API_KEY) {
    const { statusCode, ...response } =
      ResponseService.failure<TwisterErrorResponse>(
        'Service is not ready',
        {
          code: 'PROVIDER_FAILURE',
          message: 'Missing OPENAI_API_KEY',
        },
        500
      );

    return res.status(statusCode).json(response);
  }

  const { statusCode, ...response } = ResponseService.success(
    'Service is ready',
    null
  );

  return res.status(statusCode).json(response);
});

export default router;
