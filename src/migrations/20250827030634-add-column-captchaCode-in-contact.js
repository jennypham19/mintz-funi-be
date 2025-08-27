'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Contacts');
    if(!tableDescription.position){
      await queryInterface.addColumn('Contacts','captchaCode',{
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contacts', 'captchaCode');
  }
};
