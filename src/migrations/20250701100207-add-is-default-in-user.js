'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Users');
    if(!tableDescription.is_default){
      await queryInterface.addColumn('Users','is_default',{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_default');
  }
};
