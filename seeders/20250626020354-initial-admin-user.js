'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt); // Mật khẩu là '123456'

    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: hashedPassword,
      fullName: 'Quản Trị Viên',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { username: 'admin' });
  }
};