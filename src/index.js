import express from 'express';
import api from './api/api.js';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.json());

app.use(cookieParser())

app.use('/api', api);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`)
})