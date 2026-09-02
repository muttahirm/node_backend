import { AppError } from '../../errors/app-error.ts';
import {
  createPaginationMeta,
  normalizePagination
} from '../../utils/pagination.ts';
import { userRepository } from './user.repository.ts';

import type {
  ListUsersQuery,
  UpdateCurrentUserInput,
  UpdateUserInput
} from './user.validation.ts';

export const userService = {
  async listUsers(query: ListUsersQuery) {
    const pagination = normalizePagination(
      query.page,
      query.limit,
    );

    const result = await userRepository.findPage(pagination);

    return {
      users: result.users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      meta: createPaginationMeta(
        pagination,
        result.totalItems,
      )
    };
  },

  async getUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const { password, ...rest } = user as any;
    return rest;
  },

  async updateCurrentUser(
    userId: string,
    input: UpdateCurrentUserInput,
  ) {
    if (input.email) {
      const existingUser = await userRepository.findByEmail(
        input.email,
      );

      if (existingUser && existingUser.id !== userId) {
        throw AppError.conflict(
          'Another account already uses this email address',
        );
      }
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;
    if ((input as any).role !== undefined) updateData.role = (input as any).role;
    if ((input as any).isActive !== undefined) updateData.isActive = (input as any).isActive;

    const user = await userRepository.updateById(userId, updateData);

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const { password, ...rest } = user as any;
    return rest;
  },

  async updateUser(
    userId: string,
    input: UpdateUserInput,
  ) {
    if (input.email) {
      const existingUser = await userRepository.findByEmail(
        input.email,
      );

      if (existingUser && existingUser.id !== userId) {
        throw AppError.conflict(
          'Another account already uses this email address',
        );
      }
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;
    if ((input as any).role !== undefined) updateData.role = (input as any).role;
    if ((input as any).isActive !== undefined) updateData.isActive = (input as any).isActive;

    const user = await userRepository.updateById(userId, updateData);

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const { password, ...rest } = user as any;
    return rest;
  },

  async deactivateUser(userId: string) {
    const user = await userRepository.deactivateById(userId);

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const { password, ...rest } = user as any;
    return rest;
  }
};