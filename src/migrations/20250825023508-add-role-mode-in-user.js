'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'mode';
    `);
  },

  async down (queryInterface, Sequelize) {
    // Postgres không hỗ trợ xoá value khỏi ENUM
    // nên phần down thường để trống hoặc ghi chú
  }
};
