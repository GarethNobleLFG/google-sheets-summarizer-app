'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

    // Create indexes
    await queryInterface.addIndex('sheet_summaries', ['summary_type'], {
      name: 'idx_sheet_summaries_type'
    });

    await queryInterface.addIndex('sheet_summaries', ['created_at'], {
      name: 'idx_sheet_summaries_created_at'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('sheet_summaries', 'idx_sheet_summaries_created_at');
    await queryInterface.removeIndex('sheet_summaries', 'idx_sheet_summaries_type');
    
    // Drop table
    await queryInterface.dropTable('sheet_summaries');
  }
};