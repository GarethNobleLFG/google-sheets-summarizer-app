import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/databaseSetup.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    credentials: true
}));
app.use(express.json());

// Initialize everything on startup
try {
    await initializeDatabase();    
} 
catch (error) {
    console.error('App initialization failed:', error.message);
    process.exit(1); 
}

// Import routes
import userRoutes from './routes/userRoutes.js';
import sheetDataRoutes from './routes/sheetDataRoutes.js';

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Google Sheets Summarizer API',
        status: 'Server is running successfully!',
        database: 'Connected to PostgreSQL'
    });
});

app.use('/users', userRoutes);
app.use('/sheet-data', sheetDataRoutes);

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