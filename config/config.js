//config/config.js

require('dotenv').config();

const allConfigs = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '12345678',
    database: process.env.DB_DATABASE || 'mintz_db',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    },
    logging: (msg) => console.log(`[SEQUELIZE_DEV_QUERY] ${msg}`),
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  },
};

const env = process.env.NODE_ENV || 'development';
const dbConfigForCurrentEnv = allConfigs[env];

if (!dbConfigForCurrentEnv) {
  throw new Error(`Cấu hình cho môi trường "${env}" không tồn tại.`);
}

const appConfig = {
  env: env,
  port: parseInt(process.env.PORT, 10) || 3002,
  logLevel: process.env.LOG_LEVEL || 'info',
  db: dbConfigForCurrentEnv,
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only',
    accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 10) || 30,
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};


module.exports = {
  ...appConfig,

  development: allConfigs.development,
  production: allConfigs.production,
};