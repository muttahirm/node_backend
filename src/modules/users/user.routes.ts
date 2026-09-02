import { Router } from 'express';

import { authenticate } from '../../middleware/authentication.middleware.ts';
import { authorize } from '../../middleware/authorization.middleware.ts';
import { validateRequest } from '../../middleware/validation.middleware.ts';
import { asyncHandler } from '../../utils/async-handler.ts';

import {
  deactivateUser,
  getCurrentUser,
  getUser,
  listUsers,
  updateCurrentUser,
  updateUser,
} from './user.controller.ts';
import { UserRole } from './user.entity.ts';
import {
  listUsersSchema,
  updateCurrentUserSchema,
  updateUserSchema,
  userIdSchema,
} from './user.validation.ts';

const router = Router();

router.use(authenticate);

router.get('/me', asyncHandler(getCurrentUser));

router.patch('/me', validateRequest(updateCurrentUserSchema), asyncHandler(updateCurrentUser));

router.get(
  '/',
  authorize(UserRole.Admin),
  validateRequest(listUsersSchema),
  asyncHandler(listUsers),
);

router.get(
  '/:userId',
  authorize(UserRole.Admin),
  validateRequest(userIdSchema),
  asyncHandler(getUser),
);

router.patch(
  '/:userId',
  authorize(UserRole.Admin),
  validateRequest(updateUserSchema),
  asyncHandler(updateUser),
);

router.delete(
  '/:userId',
  authorize(UserRole.Admin),
  validateRequest(userIdSchema),
  asyncHandler(deactivateUser),
);

export default router;
