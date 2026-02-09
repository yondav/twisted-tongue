import { Router } from 'express';

import { TwisterService } from '../services';
import type { ProviderName } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  const { statusCode, response } = await TwisterService.generate({
    provider: req.query.provider as ProviderName | undefined,
    theme: req.query.theme as string | undefined,
    difficulty: req.query.difficulty as string | undefined,
    length: req.query.length as string | undefined,
  });

  return res.status(statusCode).json(response);
});

export default router;
