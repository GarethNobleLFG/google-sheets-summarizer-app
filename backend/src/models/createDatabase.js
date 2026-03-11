import dotenv from 'dotenv';
import sequelize from '../config/database.js';

dotenv.config();

export async function createDatabase() {
    try {
        // Check if database already exists using Sequelize
        const results = await sequelize.query(
            "SELECT 1 FROM pg_database WHERE datname = :dbName", 
            {
                replacements: { dbName: process.env.DB_NAME },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (results.length > 0) {
            console.log(`Database "${process.env.DB_NAME}" already exists`);
            return { exists: true };
        }

        // Database doesn't exist, create it
        const dbName = process.env.DB_NAME;
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(dbName)) {
            throw new Error(`Invalid database name: ${dbName}`);
        }

        await sequelize.query(`CREATE DATABASE "${dbName}"`);
        console.log(`✅ Database "${process.env.DB_NAME}" created successfully!`);
        return { created: true };
    }
    catch (error) {
        console.error('❌ Error with database:', error.message);
        return { error: error.message };
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    createDatabase();
}