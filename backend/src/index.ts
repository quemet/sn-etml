import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorMiddleware);

if (require.main === module) {
  const { connectDB } = require('./config/db');

  const start = async (): Promise<void> => {
    await connectDB();
    httpServer.listen(env.port, () => {
      console.warn(`🚀 Serveur démarré sur le port ${env.port}`);
    });
  };

  void start();
}

export { app, httpServer };
