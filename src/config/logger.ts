import pino from 'pino';

import { env } from './environment.ts';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    environment: env.NODE_ENV,
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'password',
      'passwordHash',
      '*.password',
      '*.passwordHash',
    ],
    censor: '[REDACTED]',
  },
});
