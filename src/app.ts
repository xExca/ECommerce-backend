import express from 'express';
import type { Response, Request, NextFunction } from 'express';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV, NGINX_URL } from './config/global.js';
import { banCheck, globalLimiter } from './middleware/ratelimiter.middleware.js';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // catch errors
  };

const app = express();
app.use(cors({
  origin: [NGINX_URL, 'http://localhost:3000'],
  credentials: true
}));

if(ENV === 'production') {
  console.log('Rate limiter enabled');
  app.use(asyncHandler(banCheck));
  app.use(globalLimiter);
}

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());


app.use('/api', router)

export default app
