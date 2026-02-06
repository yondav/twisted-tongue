import express from 'express';

import * as routes from './routes';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use('/twister', routes.twister);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server blasting off on port ${port} 🚀`);
});
