import mongoose from 'mongoose';
import { dbUri } from './global.js';

const connectDB = async () => {
  await mongoose.connect(dbUri!);
  console.log('Database connected');
};

export default connectDB;
