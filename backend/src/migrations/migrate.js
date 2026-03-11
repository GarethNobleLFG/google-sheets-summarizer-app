import { execSync } from 'child_process';
import sequelize from '../config/database.js';

export async function runAllPending() {
    console.log('Running database migrations...');
    
    try {
        // Test database connection first
        await sequelize.authenticate();
        console.log('Database connection established');
        
        // Run all pending migrations
        execSync('npx sequelize-cli db:migrate', { 
            stdio: 'inherit',
            cwd: process.cwd()
        });
        
        console.log('All migrations completed successfully!');
    } 
    catch (error) {
        console.error('Migration failed:', error.message);
        throw error;
    }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllPending()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}