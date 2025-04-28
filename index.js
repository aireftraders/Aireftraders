import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from Vercel's output folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// API endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Vercel requires module.exports for serverless functions
export default app;  // Changed from app.listen()