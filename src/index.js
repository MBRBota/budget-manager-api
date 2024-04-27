import express from 'express';
import api from './api/api.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());

app.use('/api', api);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`)
})