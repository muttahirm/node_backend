import type { Request, Response } from 'express';

import { AppError } from '../../errors/app-error.js';
import { sendSuccess } from '../../utils/api-response.js';
import { authService } from './auth.service.js';

import type { LoginInput, RegisterInput } from './auth.validation.js';

type AuthenticatedRequest = Request & {
  auth?: {
    userId: string;
  };
  validated?: {
    body?: RegisterInput | LoginInput;
  };
};

export const register = async (
  request: AuthenticatedRequest,
  response: Response,
): Promise<Response> => {
  const input = request.validated?.body as RegisterInput;

  const result = await authService.register(input);

  sendSuccess(response, result, {
    message: 'Account created successfully',
    statusCode: 201,
  });

  return response;
};

export const login = async (
  request: AuthenticatedRequest,
  response: Response,
): Promise<Response> => {
  const input = request.validated?.body as LoginInput;

  const result = await authService.login(input);

  sendSuccess(response, result, {
    message: 'Login successful',
  });

  return response;
};

export const getCurrentUser = async (
  request: AuthenticatedRequest,
  response: Response,
): Promise<Response> => {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  const user = await authService.getCurrentUser(request.auth.userId);

  sendSuccess(response, user);

  return response;
};
