import express from 'express';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { NGINX_URL } from './config/global.js';


const app = express();
app.use(cors({
  origin: [NGINX_URL, 'http://localhost:8000'],
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use('/api', router)

export default app