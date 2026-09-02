import { AppError } from '../../errors/app-error.ts';
import { hashPassword, verifyPassword } from '../../utils/password.ts';
import { createAccessToken } from '../../utils/token.ts';
import { userRepository } from '../users/user.repository.ts';
import { authRepository } from './auth.repository.ts';

import type { LoginInput, RegisterInput } from './auth.validation.ts';

export const authService = {
  async register(input: RegisterInput) {
    const normalizedEmail = input.email.toLowerCase();

    const existingUser = await authRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw AppError.conflict('An account with this email already exists');
    }

    const password = await hashPassword(input.password);

    const user = await authRepository.createUser({
      name: input.name,
      email: normalizedEmail,
      password,
    });

    if (!user) {
      throw AppError.badRequest('Failed to create user account');
    }

    const accessToken = createAccessToken({
      userId: user.id,
      role: user.role,
    });

    const userResponse = (user as any).toJSON?.() ?? { ...user };

    return {
      user: userResponse,
      accessToken,
    };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmailWithPassword(input.email);

    if (!user) {
      throw AppError.unauthorized('The supplied email or password is incorrect');
    }

    if (!user.isActive) {
      throw AppError.forbidden('This account has been deactivated');
    }

    const passwordMatches = await verifyPassword(input.password, user.password);

    if (!passwordMatches) {
      throw AppError.unauthorized('The supplied email or password is incorrect');
    }

    const accessToken = createAccessToken({
      userId: user.id,
      role: user.role,
    });

    const userResponse = (user as any).toJSON?.() ?? { ...user };

    return {
      user: userResponse,
      accessToken,
    };
  },

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw AppError.notFound('User not found');
    }

    return (user as any).toJSON?.() ?? { ...user };
  },
};
