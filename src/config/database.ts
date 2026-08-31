import mongoose from 'mongoose';

import { env } from './environment.ts';
import { logger } from './logger.ts';

//Promise - Represents the completion of an asynchronous operation
export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info(
      {
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
      },
      'Connected to MongoDB',
    );
  } catch (error) {
    logger.error({ err: error }, 'Error connecting to MongoDB');
    process.exit(1);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info(
      {
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
      },
      'Disconnected from MongoDB',
    );
  } catch (error) {
    logger.error({ err: error }, 'Error disconnecting from MongoDB');
  }
};
