import express from 'express';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server blasting off on port ${port} 🚀`);
});
