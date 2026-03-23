import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export default sequelize.define('SheetData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        field: 'user_id'
    },
    link: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'link'
    },
    sheet_name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'sheet_name'
    },
    frequency: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'frequency'
    },
    pre_prompt: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'pre_prompt'
    },
    post_prompt: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'post_prompt'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'usersheetdata',
    timestamps: false, // We handle created_at manually
    indexes: [
        {
            fields: ['user_id']
        },
        {
            fields: ['frequency']
        },
        {
            fields: ['created_at']
        }
    ]
});