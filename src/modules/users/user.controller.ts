import type { Request, Response } from 'express';

interface AuthRequest extends Request {
  auth?: {
    userId: string;
  };
  validated?: {
    params?: any;
    query?: any;
    body?: any;
  };
}

import { AppError } from '../../errors/app-error.ts';
import { sendSuccess } from '../../utils/api-response.ts';
import { userService } from './user.service.ts';

import type {
  ListUsersQuery,
  UpdateCurrentUserInput,
  UpdateUserInput,
  UserIdParams,
} from './user.validation.ts';

export const listUsers = async (request: Request, response: Response): Promise<Response> => {
  const query = request.validated?.query as ListUsersQuery;

  const result = await userService.listUsers(query);

  sendSuccess(response, result.users, {
    message: 'Users retrieved successfully',
    meta: result.meta,
  });
  return response;
};

export const getUser = async (request: Request, response: Response): Promise<Response> => {
  const { userId } = request.validated?.params as UserIdParams;

  const user = await userService.getUser(userId);

  sendSuccess(response, user);
  return response;
};

export const getCurrentUser = async (
  request: AuthRequest,
  response: Response,
): Promise<Response> => {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  const user = await userService.getUser(request.auth.userId);

  sendSuccess(response, user);
  return response;
};

export const updateCurrentUser = async (
  request: AuthRequest,
  response: Response,
): Promise<Response> => {
  if (!request.auth) {
    throw AppError.unauthorized();
  }

  const input = request.validated?.body as UpdateCurrentUserInput;

  const user = await userService.updateCurrentUser(request.auth.userId, input);

  sendSuccess(response, user, {
    message: 'Profile updated successfully',
  });
  return response;
};

export const updateUser = async (request: Request, response: Response): Promise<Response> => {
  const { userId } = request.validated?.params as UserIdParams;

  const input = request.validated?.body as UpdateUserInput;

  const user = await userService.updateUser(userId, input);

  sendSuccess(response, user, {
    message: 'User updated successfully',
  });
  return response;
};

export const deactivateUser = async (request: Request, response: Response): Promise<Response> => {
  const { userId } = request.validated?.params as UserIdParams;

  const user = await userService.deactivateUser(userId);

  sendSuccess(response, user, {
    message: 'User deactivated successfully',
  });
  return response;
};
