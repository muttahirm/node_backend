import type { Server } from 'node:http';

import app from './app.js';
import { connectToDatabase, disconnectFromDatabase } from './config/database.ts';
import { env } from './config/environment.js';
import { logger } from './config/logger.js';

let server: Server | undefined;
let isShuttingDown = false;

const startServer = async (): Promise<void> => {
  await connectToDatabase();

  server = app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
      },
      'HTTP server started',
    );
  });
};

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(
    {
      signal,
    },
    'Graceful shutdown started',
  );

  const forceShutdownTimer = setTimeout(() => {
    logger.fatal('Graceful shutdown timed out');
    process.exit(1);
  }, 10_000);

  forceShutdownTimer.unref();

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await disconnectFromDatabase();

    clearTimeout(forceShutdownTimer);

    logger.info('Graceful shutdown completed');

    process.exit(0);
  } catch (error) {
    logger.error(
      {
        error,
      },
      'Error during graceful shutdown',
    );

    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('unhandledRejection', (reason) => {
  logger.fatal(
    {
      reason,
    },
    'Unhandled promise rejection',
  );

  void shutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.fatal(
    {
      error,
    },
    'Uncaught exception',
  );

  void shutdown('uncaughtException');
});

startServer().catch((error: unknown) => {
  logger.fatal(
    {
      error,
    },
    'Application startup failed',
  );

  process.exit(1);
});
