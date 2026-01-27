import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import User from '../models/user.model.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;