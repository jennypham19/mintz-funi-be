'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'isPublished', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Mặc định là chưa đăng tải
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'isPublished');
  }
};