'use strict';
const bcrypt = require('bcryptjs'); // Đảm bảo bạn đã cài đặt bcryptjs

module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'Users'; 
    const adminUsername = 'admin';

    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT username FROM "${tableName}" WHERE username = :username LIMIT 1`,
      {
        replacements: { username: adminUsername },
        type: Sequelize.QueryTypes.SELECT,
        plain: true
      }
    );

    if (!existingAdmin) {
      // Băm mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);

      await queryInterface.bulkInsert(tableName, [{
        username: adminUsername,
        password: hashedPassword, 
        fullName: 'Quản Trị Viên',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});

      console.log(`Successfully inserted initial admin user: '${adminUsername}'`);
    } else {
      console.log(`Initial admin user '${adminUsername}' already exists. Skipping.`);
    }
  },

  async down (queryInterface, Sequelize) {
    // Giữ nguyên logic down, nó đã đúng
    await queryInterface.bulkDelete('Users', { username: 'admin' });
    console.log(`Successfully deleted initial admin user: 'admin'`);
  }
};