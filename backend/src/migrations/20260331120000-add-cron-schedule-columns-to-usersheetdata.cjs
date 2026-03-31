'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Add cron_schedule column
      await queryInterface.addColumn('usersheetdata', 'cron_schedule', {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Cron expression for scheduling (e.g., "0 9 * * *" for daily at 9 AM)'
      });
      
      // Add next_run_at column
      await queryInterface.addColumn('usersheetdata', 'next_run_at', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp for when the next scheduled run should occur'
      });      
    } 
    catch (error) {
      console.log('Error adding columns:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('usersheetdata', 'next_run_at');
      await queryInterface.removeColumn('usersheetdata', 'cron_schedule');
      
      console.log('Removed cron_schedule and next_run_at columns from usersheetdata table');
    } 
    catch (error) {
      console.log('Error removing columns:', error.message);
      throw error;
    }
  }
};