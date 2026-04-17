import dotenv from 'dotenv';
import sequelize from './database.js';
import '../models/sheetSummaryModel.js'; 

dotenv.config();

export async function initializeDatabase() {
    // Just test the connection - database and tables should already exist in production
    await sequelize.authenticate();
}