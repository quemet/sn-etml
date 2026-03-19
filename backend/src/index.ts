import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectDB } from './config/db';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  if (env.nodeEnv !== 'test') {
    await connectDB();
    httpServer.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  }
};

startServer();

export default app;
