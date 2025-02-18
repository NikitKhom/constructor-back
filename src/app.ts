import express from 'express';
import userRouter from './routes/userRouter';
import { checkDBConnection } from './config/db';

const app = express();

app.use('/users', userRouter);

const startServer = async (): Promise<void> => {
  await checkDBConnection();
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
};

startServer();
