import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB(uri?: string) {
  const mongoUri = uri || env.MONGO_URI;
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
