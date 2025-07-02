'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Users');
    if(!tableDescription.is_deleted){
      await queryInterface.addColumn('Users','is_deleted',{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_deleted');
  }
};
