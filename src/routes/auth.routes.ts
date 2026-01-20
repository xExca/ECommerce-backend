import { Router, type NextFunction, type Request, type Response } from 'express';
import { ENV } from '../config/global.js';
import { authLimiter } from '../middlewares/ratelimiter.middleware.js';
import { googleLogin } from '../controllers/gooogle.controller.js';


const router = Router();
const limiter = ENV === 'production' ? authLimiter : (req: Request, res: Response, next : NextFunction) => next();

router.post('/google', limiter, googleLogin);

export default router;