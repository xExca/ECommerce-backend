import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.MONGO_STRING_CONNECTION;
const port = process.env.PORT;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'access_token';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const BASE_URL = process.env.BASE_URL;
const NGINX_URL = process.env.NGINX_URL 
const ENV = process.env.NODE_ENV || 'development';

export { dbUri, port, GOOGLE_CLIENT_ID, ACCESS_TOKEN, REFRESH_TOKEN, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, BASE_URL, NGINX_URL, ENV };