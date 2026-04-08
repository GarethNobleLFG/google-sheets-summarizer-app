'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Add sums_used column to users table
      await queryInterface.addColumn('users', 'sums_used', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of summaries used by the user'
      });
      
      console.log('Added sums_used column to users table');
    } 
    catch (error) {
      console.log('Error adding sums_used column:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove sums_used column
      await queryInterface.removeColumn('users', 'sums_used');
      
      console.log('Removed sums_used column from users table');
    } 
    catch (error) {
      console.log('Error removing sums_used column:', error.message);
      throw error;
    }
  }
};