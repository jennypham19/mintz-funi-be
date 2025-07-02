'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Users');
    if(!tableDescription.email){
      await queryInterface.addColumn('Users','email',{
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    if(!tableDescription.address){
      await queryInterface.addColumn('Users','address',{
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    if(!tableDescription.phone_number){
      await queryInterface.addColumn('Users','phone_number',{
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    if(!tableDescription.captchaCode){
      await queryInterface.addColumn('Users','captchaCode',{
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    if(!tableDescription.avatar_url){
      await queryInterface.addColumn('Users','avatar_url',{
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'email');
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'phone_number');
    await queryInterface.removeColumn('Users', 'captchaCode');
    await queryInterface.removeColumn('Users', 'avatar_url');
  }
};
