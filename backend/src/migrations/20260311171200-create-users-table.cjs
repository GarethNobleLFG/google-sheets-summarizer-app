'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table exists first
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('users')) {
      await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        hashed_password: {
          type: Sequelize.STRING,
          allowNull: false
        }
      });
      
      console.log('Created users table');
    } 
    else {
      console.log('Table users already exists, skipping creation');
    }

    // Add indexes safely
    try {
      await queryInterface.addIndex('users', ['email'], {
        name: 'idx_users_email',
        unique: true
      });
    } 
    catch (error) {
      console.log('Index idx_users_email may already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'idx_users_email');
    await queryInterface.dropTable('users');
  }
};