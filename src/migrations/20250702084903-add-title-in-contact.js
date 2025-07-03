'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Contacts');
    if(!tableDescription.title){
      await queryInterface.addColumn('Contacts','title',{
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contacts', 'title');
  }
};
