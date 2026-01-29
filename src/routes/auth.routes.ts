import { Router, type NextFunction, type Request, type Response } from 'express';
import { limiter } from '../middlewares/ratelimiter.middleware.js';
import { googleLink, googleLogin } from '../controllers/google.controller.js';
import { requireAuth } from '../middlewares/auth.middlware.js';
import { facebookLink, facebookLogin } from '../controllers/facebook.controller.js';
import { refresh } from '../controllers/refresh.controller.js';
import { login, logout, signup } from '../controllers/authentication.controller.js';
import { verify, verifySignupOtp } from '../controllers/verification.controller.js';
import { resendOtp, resendOtpSignup } from '../controllers/resend.controller.js';


const router = Router();

router.post('/refresh', refresh);
router.post('/google', limiter, googleLogin);
router.post('/google/link', requireAuth, googleLink);
router.post('/facebook', limiter, facebookLogin);
router.post('/facebook/link', requireAuth, facebookLink);
router.post('/login', limiter, login);
router.post('/logout', logout);
router.post('/verify', verify)
router.get('/resend/:identifier', limiter, resendOtp);
router.post('/signup', limiter, signup);
router.post('/signup/verify', verifySignupOtp);
router.get('/signup/resend/:identifier', limiter, resendOtpSignup);

export default router;