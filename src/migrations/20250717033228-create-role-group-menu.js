'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('RoleGroupMenus', {
      role_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'RoleGroups', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      menu_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: { model: 'Menus', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('RoleGroupMenus')
  }
};
