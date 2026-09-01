import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { AppError } from '../errors/app-error.ts';

interface RequestInput {
  body: unknown;
  params: unknown;
  query: unknown;
}

export const validateRequest = (schema: ZodType): RequestHandler => {
  return (request, _response, next): void => {
    const input: RequestInput = {
      body: request.body,
      params: request.params,
      query: request.query,
    };

    const result = schema.safeParse(input);

    if (!result.success) {
      next(AppError.badRequest('Request validation failed', result.error.flatten()));

      return;
    }

    request.validated = result.data as NonNullable<Express.Request['validated']>;

    next();
  };
};
