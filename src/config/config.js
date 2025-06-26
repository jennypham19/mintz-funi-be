// config/config.js
require('dotenv').config(); 

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10), // Parse trực tiếp ở đây
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    // Quan trọng: Sequelize CLI có thể cần một số thuộc tính migrationStorage nếu dùng JS config
    // migrationStorage: 'sequelize',
    // migrationStorageTableName: 'SequelizeMeta',
    // seederStorage: 'sequelize',
    // seederStorageTableName: 'SequelizeData',
  },
  test: {
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST_TEST,
    port: parseInt(process.env.DB_PORT_TEST, 10),
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_DATABASE_PROD,
    host: process.env.DB_HOST_PROD,
    port: parseInt(process.env.DB_PORT_PROD, 10),
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: true },
    },
    logging: false,
  },
};