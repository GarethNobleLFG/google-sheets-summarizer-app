import dotenv from 'dotenv';
import sequelize from './database.js';
import { createDatabase } from '../models/createDatabase.js';
import { execSync } from 'child_process';
import '../models/sheetSummaryModel.js'; 

dotenv.config();

export async function initializeDatabase() {
    // Create database if needed
    const dbResult = await createDatabase();
    if (dbResult.error) {
        throw new Error(`Database setup failed: ${dbResult.error}`);
    }

    // Test Sequelize connection
    await sequelize.authenticate();
    console.log('Sequelize database connection established successfully.');
    
    // Run Sequelize CLI migrations instead of using explicit migrations.js file.
    try {
        console.log('Running Sequelize migrations...');
        execSync('npx sequelize-cli db:migrate', { 
            stdio: 'inherit',
            cwd: process.cwd()
        });
        console.log('All migrations completed successfully!');
    } 
    catch (error) {
        console.error('Migration failed:', error.message);
        throw new Error(`Migration failed: ${error.message}`);
    }
    
    console.log('Database initialization complete');
}

export async function closeDatabase() {
    await sequelize.close();
}