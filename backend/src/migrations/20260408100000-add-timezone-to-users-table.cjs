'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Add timezone column to users table
      await queryInterface.addColumn('users', 'timezone', {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'UTC',
        comment: 'User timezone (e.g., America/New_York, Europe/London)'
      });
      
      console.log('Added timezone column to users table');
    } 
    catch (error) {
      console.log('Error adding timezone column:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove timezone column
      await queryInterface.removeColumn('users', 'timezone');
      
      console.log('Removed timezone column from users table');
    } 
    catch (error) {
      console.log('Error removing timezone column:', error.message);
      throw error;
    }
  }
};