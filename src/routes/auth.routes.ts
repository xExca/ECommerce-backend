import { Router, type NextFunction, type Request, type Response } from 'express';
import { ENV } from '../config/global.js';
import { authLimiter } from '../middlewares/ratelimiter.middleware.js';
import { googleLink, googleLogin } from '../controllers/google.controller.js';
import { requireAuth } from '../middlewares/auth.middlware.js';
import { facebookLink, facebookLogin } from '../controllers/facebook.controller.js';
import { refresh } from '../controllers/refresh.controller.js';


const router = Router();
const limiter = ENV === 'production' ? authLimiter : (req: Request, res: Response, next : NextFunction) => next();

router.post('/refresh', refresh);
router.post('/google', limiter, googleLogin);
router.post('/google/link', requireAuth, googleLink);
router.post('/facebook', limiter, facebookLogin);
router.post('/facebook/link', requireAuth, facebookLink);
router.get('/test',  requireAuth, (req: Request, res: Response) => res.status(200).json({ message: "Hello World" }));

export default router;