import dotenv from 'dotenv';
import sequelize from './database.js'; 
import { createDatabase } from '../modules/createDatabase.js';
import { runAllPending } from '../migrations/migrate.js';

dotenv.config();

export async function initializeDatabase() {
    // Create database if needed
    const dbResult = await createDatabase();
    if (dbResult.error) {
        throw new Error(`Database setup failed: ${dbResult.error}`);
    }

    // Test Sequelize connection
    try {
        await sequelize.authenticate();
        console.log('Sequelize database connection established successfully.');
    } 
    catch (error) {
        throw new Error(`Sequelize connection failed: ${error.message}`);
    }
    
    // Run SQL migrations
    try {
        await runAllPending();
    }
    catch (error) {
        console.error('Migration failed:', error.message);
        throw new Error(`Migration failed: ${error.message}`);
    }
    
    console.log('Database initialization complete');
}

export async function closeDatabase() {
    await sequelize.close(); // Use Sequelize close instead of pool.end()
}