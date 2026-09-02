import type { Response } from 'express';

interface SuccessResponseOptions {
  message?: string;
  statusCode?: number;
  meta?: unknown;
}

export const sendSuccess = (
  response: Response,
  data: unknown,
  options: SuccessResponseOptions = {},
): void => {
  const { message, statusCode = 200, meta } = options;

  const responseBody: Record<string, unknown> = {
    success: true,
    data,
  };

  if (message) {
    responseBody.message = message;
  }

  if (meta) {
    responseBody.meta = meta;
  }

  response.status(statusCode).json(responseBody);
};
