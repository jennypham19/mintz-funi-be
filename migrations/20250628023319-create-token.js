'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tokens', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      token: { type: Sequelize.STRING, allowNull: false, unique: true },
      // type: 'refresh', 'resetPassword', etc.
      type: { type: Sequelize.STRING, allowNull: false },
      expires: { type: Sequelize.DATE, allowNull: false },
      blacklisted: { type: Sequelize.BOOLEAN, defaultValue: false },
      // Khóa ngoại tới bảng Users
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens');
  }
};