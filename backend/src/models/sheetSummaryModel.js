import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export default sequelize.define('SheetSummary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    summary_type: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'summary_type' // Maps to snake_case column name.
    },
    text_version: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'text_version'
    },
    html_version: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'html_version'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'sheet_summaries',
    timestamps: false, // We handle created_at manually
    indexes: [
        {
            fields: ['summary_type']
        },
        {
            fields: ['created_at']
        }
    ]
});