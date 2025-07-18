'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('RoleGroupMenus');
    if(!tableDescription.id){
      await queryInterface.addColumn('RoleGroupMenus','id',{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('RoleGroupMenus', 'id');
  }
};
