import { Router, type NextFunction, type Request, type Response } from 'express';
import { ENV } from '../config/global.js';
import { authLimiter } from '../middlewares/ratelimiter.middleware.js';
import { googleLink, googleLogin } from '../controllers/google.controller.js';
import { requireAuth } from '../middlewares/auth.middlware.js';
import { facebookLink, facebookLogin } from '../controllers/facebook.controller.js';
import { refresh } from '../controllers/refresh.controller.js';
import { login, logout, signup } from '../controllers/authentication.controller.js';
import { verify, verifySignupOtp } from '../controllers/verification.controller.js';
import { resendOtp } from '../controllers/resend.controller.js';


const router = Router();
const limiter = ENV === 'production' ? authLimiter : (req: Request, res: Response, next : NextFunction) => next();

router.post('/refresh', refresh);
router.post('/google', limiter, googleLogin);
router.post('/google/link', requireAuth, googleLink);
router.post('/facebook', limiter, facebookLogin);
router.post('/facebook/link', requireAuth, facebookLink);
router.post('/login', limiter, login);
router.post('/logout', requireAuth, logout);
router.post('/verify', verify)
router.get('/resend/:identifier', limiter, resendOtp);
router.post('/signup', limiter, signup);
router.post('/signup/verify', verifySignupOtp);

export default router;