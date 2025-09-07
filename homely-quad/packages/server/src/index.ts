import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

// Server configuration
const SERVER_CONFIG = {
  APP_NAME: 'Homely Quad',
  PORT: process.env.PORT || 3001,
  HOST: '0.0.0.0',
  DB_CONFIG: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'homely_quad',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
  },
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
};

const app = express();
const server = createServer(app);
const PORT = SERVER_CONFIG.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    app: SERVER_CONFIG.APP_NAME
  });
});

// Start server
async function startServer() {
  try {
    server.listen(PORT, SERVER_CONFIG.HOST, () => {
      console.log(`🚀 ${SERVER_CONFIG.APP_NAME} Server running on port ${PORT}`);
      console.log(`📱 Mobile API: http://localhost:${PORT}/api`);
      console.log(`🌐 Web API: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;