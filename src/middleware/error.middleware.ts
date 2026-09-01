import mongoose from 'mongoose';

import type { ErrorRequestHandler } from 'express';

import { env } from '../config/environment.js';
import { logger } from '../config/logger.js';
import { AppError } from '../errors/app-error.js';
import { ErrorCode } from '../errors/error-codes.ts';

interface DuplicateKeyError {
  code: number;
  keyValue?: Record<string, unknown>;
}

const isDuplicateKeyError = (error: unknown): error is DuplicateKeyError => {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
): void => {
  if (response.headersSent) {
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    });

    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    response.status(400).json({
      success: false,
      error: {
        code: ErrorCode.ValidationError,
        message: `Invalid value for ${error.path}`,
      },
    });

    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({
      success: false,
      error: {
        code: ErrorCode.ValidationError,
        message: 'Database validation failed',
        details: Object.values(error.errors).map((validationError) => validationError.message),
      },
    });

    return;
  }

  if (isDuplicateKeyError(error)) {
    response.status(409).json({
      success: false,
      error: {
        code: ErrorCode.Conflict,
        message: 'A record with this value already exists',
        details: error.keyValue,
      },
    });

    return;
  }

  logger.error({ error }, 'Unhandled application error');

  response.status(500).json({
    success: false,
    error: {
      code: ErrorCode.InternalServerError,
      message:
        env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : error instanceof Error
            ? error.message
            : 'Unknown server error',
    },
  });
};
