import express from 'express';
import dotenv from 'dotenv';
import { googleAuth, googleCallback, outlookAuth, outlookCallback } from './controllers/emailController';

dotenv.config();

const app = express();

app.get('/auth/google', googleAuth);
app.get('/auth/google/callback', googleCallback);
app.get('/auth/outlook', outlookAuth);
app.get('/auth/outlook/callback', outlookCallback);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
