import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes.ts';
import userRoutes from '../modules/users/user.routes.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
