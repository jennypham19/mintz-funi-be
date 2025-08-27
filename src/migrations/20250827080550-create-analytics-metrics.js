'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AnalyticsMetrics', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      property_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      page_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      active_users: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      page_views: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sessions: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      raw_response: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });

    await queryInterface.addIndex('AnalyticsMetrics', ['property_id', 'date']);
    await queryInterface.addIndex('AnalyticsMetrics', ['page_path']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('AnalyticsMetrics');
  }
};
