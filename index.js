import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'AirefTraders Server is Running!',
    timestamp: new Date().toISOString() 
  });
});

// Client-Side Routing (for React/Vue/Angular)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});