'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'Menus';

    const menusToSeed = [
      { code: '001', name: 'Trang chủ', path: '/manage/home', icon: 'HomeOutlined'},
      { code: '002', name: 'Quản lý thông tin', path: '/manage/customer-info', icon: 'AccountCircleOutlined'},
      { code: '003', name: 'Quản lý bài viết', path: '/manage/blog', icon: 'PostAdd'},
    ];
    
    const menusToInsert = [];

    for (const menuData of menusToSeed) {
      const existingMenu = await queryInterface.sequelize.query(
        `SELECT code FROM "${tableName}" WHERE code = :code LIMIT 1`,
        {
          replacements: { code: menuData.code},
          type: Sequelize.QueryTypes.SELECT,
          plain: true
        }
      );

      if(!existingMenu){
        menusToInsert.push({
          ...menuData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Menu with code ${menuData.code} will be inserted`);
      }else{
        console.log(`Menu with code ${menuData.code} already exists. Skipping.`);
      }
    }

    if(menusToInsert.length > 0) {
      await queryInterface.bulkInsert(tableName, menusToInsert, {});
      console.log(`Successfully inserted ${menusToInsert.length} new menus.`);
    }else{
      console.log('No new menus to insert. Database is up to date with seed data for menus.');
    }
  },

  async down (queryInterface, Sequelize) {
    const tableName = 'Menus';
    await queryInterface.bulkDelete(tableName, {
      code: ['001', '002', '003']
    }, {});
  }
};
