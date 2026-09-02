import { z } from 'zod';

import { UserRole } from './user.entity.ts';

const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB identifier');

export const listUsersSchema = z.object({
  body: z.unknown().optional(),

  params: z.object({}),

  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

export const userIdSchema = z.object({
  body: z.unknown().optional(),

  params: z.object({
    userId: mongoIdSchema,
  }),

  query: z.object({}),
});

export const updateCurrentUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      email: z.string().trim().email().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, 'At least one field must be provided'),

  params: z.object({}),

  query: z.object({}),
});

export const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      email: z.string().trim().email().optional(),
      role: z.nativeEnum(UserRole).optional(),
      isActive: z.boolean().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, 'At least one field must be provided'),

  params: z.object({
    userId: mongoIdSchema,
  }),

  query: z.object({}),
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];

export type UserIdParams = z.infer<typeof userIdSchema>['params'];

export type UpdateCurrentUserInput = z.infer<typeof updateCurrentUserSchema>['body'];

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
