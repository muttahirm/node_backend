import type { RequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';
import { userRepository } from '../modules/users/user.repository.ts';
import { asyncHandler } from '../utils/async-handler.js';
import { verifyAccessToken } from '../utils/token.js';

export const authenticate = asyncHandler(async (request, _response, next): Promise<void> => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw AppError.unauthorized('A Bearer access token is required');
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();

  if (!token) {
    throw AppError.unauthorized('Access token is missing');
  }

  const payload = verifyAccessToken(token);

  const user = await userRepository.findById(payload.userId);

  if (!user || !user.isActive) {
    throw AppError.unauthorized('The user associated with this token is unavailable');
  }

  request.user = {
    id: user.id,
    role: user.role,
  };

  next();
}) as RequestHandler;
