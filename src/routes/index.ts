import { Router } from 'express';

const router = Router();

router.get('/test', (req, res) => {
  return res.status(200).json({ message: 'test' });
})

export default router;