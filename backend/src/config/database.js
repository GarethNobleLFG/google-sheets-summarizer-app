import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

if (process.env.DB_CONNECTION_TYPE === 'local') {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 20,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
    );
} else {
    sequelize = new Sequelize(process.env.DATABASE_PUBLIC_URL, {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    });
}

export default sequelize;