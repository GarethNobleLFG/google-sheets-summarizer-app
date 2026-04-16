import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export default sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        field: 'email'
    },
    hashed_password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'hashed_password'
    },
    sums_used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'sums_used'
    },
    timezone: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'UTC',
        field: 'timezone'
    }
}, {
    tableName: 'users',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});