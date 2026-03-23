'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Add pre_prompt column
      await queryInterface.addColumn('usersheetdata', 'pre_prompt', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      
      // Add post_prompt column
      await queryInterface.addColumn('usersheetdata', 'post_prompt', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      
      console.log('Added pre_prompt and post_prompt columns to usersheetdata table');
    } 
    catch (error) {
      console.log('Error adding columns:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('usersheetdata', 'post_prompt');
      await queryInterface.removeColumn('usersheetdata', 'pre_prompt');
      
      console.log('Removed pre_prompt and post_prompt columns from usersheetdata table');
    } 
    catch (error) {
      console.log('Error removing columns:', error.message);
      throw error;
    }
  }
};