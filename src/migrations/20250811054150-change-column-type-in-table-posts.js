'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Posts');
    if(!tableDescription.category){
      await queryInterface.changeColumn('Posts', 'category', {
        type: Sequelize.INTEGER, // Kiểu dữ liệu mới
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'category', {
      type: Sequelize.STRING, // Kiểu dữ liệu cũ
      allowNull: true
    })
  }
};
