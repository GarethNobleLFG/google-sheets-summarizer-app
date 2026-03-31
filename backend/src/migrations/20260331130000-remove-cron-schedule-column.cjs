'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Remove cron_schedule column
      await queryInterface.removeColumn('usersheetdata', 'cron_schedule');
      
      console.log('Removed cron_schedule column from usersheetdata table');
    } 
    catch (error) {
      console.log('Error removing cron_schedule column:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Add cron_schedule column back
      await queryInterface.addColumn('usersheetdata', 'cron_schedule', {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Cron expression for scheduling (e.g., "0 9 * * *" for daily at 9 AM)'
      });
      
      console.log('Re-added cron_schedule column to usersheetdata table');
    } 
    catch (error) {
      console.log('Error adding back cron_schedule column:', error.message);
      throw error;
    }
  }
};