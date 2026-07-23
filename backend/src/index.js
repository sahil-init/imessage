import express, { urlencoded } from 'express';
import 'dotenv/config';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './lib/db.js';
import job from './lib/cron.js';

const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), 'public');

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// if the public directory exists, serve the static files
// this is for the production build
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get('/{*any}', (req, res, next) => {
    res.sendFile(path.join(publicDir, 'index.html'), (err) => next(err));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on PORT:${PORT}`);

  if (process.env.NODE_ENV === 'production') job.start();
});
/* 
git add .
git commit -m 'Add cron job to send health check requests every 14 minutes'
git push origin development
git checkout main
git pull origin main
git merge development
git push origin main
git checkout development
git merge main
*/
