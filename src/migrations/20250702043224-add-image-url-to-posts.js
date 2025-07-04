'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true, // Cho phép bài viết không có ảnh
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'imageUrl');
  }
};