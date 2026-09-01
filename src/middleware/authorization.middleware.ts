import type { RequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';
import type { UserRole } from '../modules/users/user.model.ts';

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (request, _response, next): void => {
    if (!request.user) {
      next(AppError.unauthorized());
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      next(AppError.forbidden());
      return;
    }

    next();
  };
};
