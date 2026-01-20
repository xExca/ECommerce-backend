import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.get('/test', (req, res) => {
  return res.status(200).json({ message: "Hello World" });
})

export default router;