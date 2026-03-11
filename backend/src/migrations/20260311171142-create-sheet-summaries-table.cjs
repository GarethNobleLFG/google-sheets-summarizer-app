'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table exists first
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('sheet_summaries')) {
      await queryInterface.createTable('sheet_summaries', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        summary_type: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        text_version: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        html_version: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
      
      console.log('Created sheet_summaries table');
    } 
    else {
      console.log('Table sheet_summaries already exists, skipping creation');
    }

    // Add indexes safely
    try {
      await queryInterface.addIndex('sheet_summaries', ['summary_type'], {
        name: 'idx_sheet_summaries_type'
      });
    } 
    catch (error) {
      console.log('Index idx_sheet_summaries_type may already exist');
    }

    try {
      await queryInterface.addIndex('sheet_summaries', ['created_at'], {
        name: 'idx_sheet_summaries_created_at'
      });
    } 
    catch (error) {
      console.log('Index idx_sheet_summaries_created_at may already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('sheet_summaries', 'idx_sheet_summaries_created_at');
    await queryInterface.removeIndex('sheet_summaries', 'idx_sheet_summaries_type');
    await queryInterface.dropTable('sheet_summaries');
  }
};