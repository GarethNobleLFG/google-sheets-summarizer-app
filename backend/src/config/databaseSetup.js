import dotenv from 'dotenv';
import sequelize from './database.js';
import '../models/sheetSummaryModel.js'; 

dotenv.config();

export async function initializeDatabase() {
    // Add timeout for Cloud Run
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    );
    
    await Promise.race([
        sequelize.authenticate(),
        timeout
    ]);
}