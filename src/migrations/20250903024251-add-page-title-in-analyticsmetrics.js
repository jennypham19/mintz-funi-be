'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('AnalyticsMetrics');
    if(!tableDescription.page_title){
      await queryInterface.addColumn('AnalyticsMetrics','page_title',{
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AnalyticsMetrics', 'page_title');
  }
};
