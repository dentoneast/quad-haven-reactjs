import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { db } from './db';
import { users } from '../../shared/schema';

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
  console.error('Please configure JWT_SECRET in Replit Secrets.');
  process.exit(1);
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.error('❌ CRITICAL: JWT_REFRESH_SECRET environment variable is not set!');
  console.error('Please configure JWT_REFRESH_SECRET in Replit Secrets.');
  process.exit(1);
}

// Server configuration
const SERVER_CONFIG = {
  APP_NAME: 'Homely Quad',
  PORT: Number(process.env.PORT) || 3001,
  HOST: '0.0.0.0',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};

const app = express();
const server = createServer(app);
const PORT: number = SERVER_CONFIG.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const userCount = await db.select().from(users).then(rows => rows.length);
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      app: SERVER_CONFIG.APP_NAME,
      database: {
        connected: true,
        userCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      app: SERVER_CONFIG.APP_NAME,
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await db.select().from(users).limit(1);
    console.log('✅ Database connection successful');
    
    server.listen(PORT, SERVER_CONFIG.HOST, () => {
      console.log(`🚀 ${SERVER_CONFIG.APP_NAME} Server running on port ${PORT}`);
      console.log(`📱 Mobile API: http://localhost:${PORT}/api`);
      console.log(`🌐 Web API: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔑 JWT Secret configured: ${SERVER_CONFIG.JWT_SECRET ? 'Yes' : 'No'}`);
      console.log(`🔑 JWT Refresh Secret configured: ${SERVER_CONFIG.JWT_REFRESH_SECRET ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;