'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'Actions';
    const actionsToSeed = [
      { menu_id: 1, code: '001001', name: 'Xem' },
      { menu_id: 1, code: '001005', name: 'Xem chi tiết' },
      { menu_id: 2, code: '002001', name: 'Xem' },
      { menu_id: 2, code: '002005', name: 'Xem chi tiết' },
      { menu_id: 3, code: '003001', name: 'Xem' },
      { menu_id: 3, code: '003002', name: 'Lưu/Tạo', path: '/create' },
      { menu_id: 3, code: '003003', name: 'Cập nhật/Chỉnh sửa', path: '/edit/:postId' },
      { menu_id: 3, code: '003005', name: 'Xem chi tiết', path: '/:postId' },
    ];

    const actionsToInsert = [];

    for (const actionData of actionsToSeed) {
      const existingAction = await queryInterface.sequelize.query(
        `SELECT code FROM "${tableName}" WHERE code = :code LIMIT 1`,
        {
          replacements: { code: actionData.code },
          type: Sequelize.QueryTypes.SELECT,
          plain: true
        }
      );

      if (!existingAction) {
        actionsToInsert.push({
          ...actionData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Room with code ${actionData.code} will be inserted.`);
      } else {
        console.log(`Room with code ${actionData.code} already exists. Skipping.`);
      }
    }

    if (actionsToInsert.length > 0) {
      await queryInterface.bulkInsert(tableName, actionsToInsert, {});
      console.log(`Successfully inserted ${actionsToInsert.length} new actions.`);
    } else {
      console.log('No new actions to insert. Database is up to date with seed data for actions.');
    }
  },

  async down (queryInterface, Sequelize) {
    const tableName = 'Actions';
    const codesToDelete = [' 001001, 001005, 002001, 002005, 003001, 003002, 003003, 003005'];
    await queryInterface.bulkDelete(tableName, {
      code: {
        [Sequelize.Op.in]: codesToDelete
      }
    }, {});
  }
};
