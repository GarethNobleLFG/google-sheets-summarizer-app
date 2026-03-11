const dotenv = require('dotenv');
dotenv.config();

// Debug: log the environment variables
console.log('DB Config Debug:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_CONNECTION_TYPE:', process.env.DB_CONNECTION_TYPE);
console.log('DATABASE_PUBLIC_URL:', process.env.DATABASE_PUBLIC_URL ? 'SET' : 'NOT SET');

// Match the logic from your database.js
const config = {};

if (process.env.DB_CONNECTION_TYPE === 'local') {
  // Local development config
  config.development = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: console.log
  };
} 
else {
  // External database config
  config.development = {
    use_env_variable: 'DATABASE_PUBLIC_URL',
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  };
}

module.exports = config;