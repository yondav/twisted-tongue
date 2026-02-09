import { Router } from 'express';

import { ResponseService } from '../services';

const router = Router();

router.get('/', (req, res) => {
  const { statusCode, ...response } = ResponseService.success(
    'Service is healthy',
    null
  );

  return res.status(statusCode).json(response);
});

export default router;
