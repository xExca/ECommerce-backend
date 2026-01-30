import express from 'express';
import type { Response, Request, NextFunction } from 'express';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV, NGINX_URL } from './config/global.js';
import { banCheck, globalLimiter } from './middlewares/ratelimiter.middleware.js';
import { errorHandler } from './middlewares/error.middlware.js';
import path from 'node:path';

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

const app = express();
app.use(cors({
  origin: NGINX_URL,
  credentials: true
}));

if(ENV === 'production') {
  console.log('Rate limiter enabled');
  app.use(asyncHandler(banCheck));
  app.use(globalLimiter);
}
app.use("/uploads", cors(), express.static(path  .join(process.cwd(), "public/uploads")));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(errorHandler);

app.use('/api', router)

export default app
