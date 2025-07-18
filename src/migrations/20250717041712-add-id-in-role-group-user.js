'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('UserRoles');
    if(!tableDescription.id){
      await queryInterface.addColumn('UserRoles','id',{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserRoles', 'id');
  }
};
