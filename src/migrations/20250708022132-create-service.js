'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Services', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      title: { type: Sequelize.STRING, allowNull: true},
      image_url: { type: Sequelize.STRING, allowNull: true},
      content: { type: Sequelize.STRING, allowNull: true},
      createdAt: { allowNull: false, type: Sequelize.DATE},
      updatedAt: { allowNull: false, type:Sequelize.DATE}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Services')
  }
};
