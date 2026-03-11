import dotenv from 'dotenv';
import express from 'express';
import { initializeDatabase } from './config/databaseSetup.js';
import { startScheduler, stopScheduler } from './services/cronScheduler.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Initialize database on first request.
let dbInitialized = false;

app.use(async (req, res, next) => {
    if (!dbInitialized) {
        try {
            await initializeDatabase();
            
            // Start the cron scheduler after database is initialized
            startScheduler();
            
            dbInitialized = true;
        } 
        catch (error) {
            console.error('❌ Database initialization failed:', error.message);
            return res.status(500).json({
                error: 'Database initialization failed',
                message: error.message
            });
        }
    }
    next();
});

// Add graceful shutdown handler
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    stopScheduler();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    stopScheduler();
    process.exit(0);
});

// Import routes
import userRoutes from './routes/userRoutes.js';

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Google Sheets Summarizer API',
        status: 'Server is running successfully!',
        database: 'Connected to PostgreSQL'
    });
});

app.use('/users', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

export default app;