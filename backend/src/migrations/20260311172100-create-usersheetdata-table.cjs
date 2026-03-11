'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table exists first
    const tables = await queryInterface.showAllTables();
    
    if (!tables.includes('usersheetdata')) {
      await queryInterface.createTable('usersheetdata', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        link: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        sheet_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        frequency: {
          type: Sequelize.STRING,
          allowNull: false
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
      
      console.log('Created usersheetdata table');
    } 
    else {
      console.log('Table usersheetdata already exists, skipping creation');
    }

    // Add indexes safely
    try {
      await queryInterface.addIndex('usersheetdata', ['user_id'], {
        name: 'idx_usersheetdata_user_id'
      });
    } 
    catch (error) {
      console.log('Index idx_usersheetdata_user_id may already exist');
    }

    try {
      await queryInterface.addIndex('usersheetdata', ['frequency'], {
        name: 'idx_usersheetdata_frequency'
      });
    } 
    catch (error) {
      console.log('Index idx_usersheetdata_frequency may already exist');
    }

    try {
      await queryInterface.addIndex('usersheetdata', ['created_at'], {
        name: 'idx_usersheetdata_created_at'
      });
    } 
    catch (error) {
      console.log('Index idx_usersheetdata_created_at may already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('usersheetdata', 'idx_usersheetdata_created_at');
    await queryInterface.removeIndex('usersheetdata', 'idx_usersheetdata_frequency');
    await queryInterface.removeIndex('usersheetdata', 'idx_usersheetdata_user_id');
    await queryInterface.dropTable('usersheetdata');
  }
};