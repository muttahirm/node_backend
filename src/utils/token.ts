import jwt from 'jsonwebtoken';

import type { JwtPayload, SignOptions } from 'jsonwebtoken';

import { env } from '../config/environment.ts';
import { AppError } from '../errors/app-error.ts';
//fix it later
import { UserRole } from '../modules/users/user.model.ts';

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
}

export const createAccessToken = (payload: AccessTokenPayload): string => {
  const options: SignOptions = {
    subject: payload.userId,
    expiresIn: env.JWT_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
  };

  return jwt.sign(
    {
      role: payload.role,
    },
    env.JWT_SECRET,
    options,
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  let decoded: string | JwtPayload;

  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw AppError.unauthorized('Invalid or expired access token');
  }

  if (
    typeof decoded === 'string' ||
    typeof decoded.sub !== 'string' ||
    typeof decoded.role !== 'string'
  ) {
    throw AppError.unauthorized('Invalid access token payload');
  }

  if (!Object.values(UserRole).includes(decoded.role as UserRole)) {
    throw AppError.unauthorized('Invalid user role in access token');
  }

  return {
    userId: decoded.sub,
    role: decoded.role as UserRole,
  };
};
