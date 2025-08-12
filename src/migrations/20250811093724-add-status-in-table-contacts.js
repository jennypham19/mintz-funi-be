'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Contacts');
    if(!tableDescription.status){
      await queryInterface.addColumn('Contacts','status',{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contacts', 'status');
  }
};
