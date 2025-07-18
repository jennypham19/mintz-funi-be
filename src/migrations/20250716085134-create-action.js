'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Actions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menu_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Menus', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Actions')
  }
};
