import cors from 'cors';
import express from 'express';

import { CLIENT_URL, PORT } from './lib';
import * as routes from './routes';

const app = express();
const port = PORT ? Number(PORT) : 3001;

app.use(
  cors({
    origin: [CLIENT_URL || 'http://localhost:5678'],
    methods: ['GET', 'POST'],
  })
);

app.use('/ready', routes.ready);
app.use('/twister', routes.twister);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server blasting off on port ${port} 🚀`);
});
