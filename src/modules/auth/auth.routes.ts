import { Router } from 'express';

import { authenticate } from '../../middleware/authentication.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';

import { getCurrentUser, login, register } from './auth.controller.ts';
import { loginSchema, registerSchema } from './auth.validation.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), asyncHandler(register as any));

router.post('/login', validateRequest(loginSchema), asyncHandler(login as any));

router.get('/me', authenticate, asyncHandler(getCurrentUser as any));

export default router;
