import express from 'express';
import { config } from '@dotenvx/dotenvx';
import connectDb from './utils/db.js';
import userRoutes from './routes/user.js';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
config();
//
cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api_Key,
  api_secret: process.env.Cloud_Api_Secret,
});
//
const app = express();
//
app.use(express.json());
app.use(cors());
//
app.use('/api/v1', userRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  connectDb();
  console.log(`Server is runnng on port ${port}`);
});
