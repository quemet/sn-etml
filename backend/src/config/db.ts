import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    console.warn('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.warn('🔌 MongoDB déconnecté');
};
