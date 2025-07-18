'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('RoleGroupActions', {
      role_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'RoleGroups', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      action_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Actions', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('RoleGroupActions')
  }
};
