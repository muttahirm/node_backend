import { z } from 'zod';

import { MINIMUM_PASSWORD_LENGTH } from './auth.constants.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),

    email: z.string().trim().email(),

    password: z
      .string()
      .min(MINIMUM_PASSWORD_LENGTH)
      .max(128)
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/\d/, 'Password must contain a number'),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),

  params: z.object({}),

  query: z.object({}),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];

export type LoginInput = z.infer<typeof loginSchema>['body'];
