// src/config/index.js
const dotenv = require('dotenv');
const path = require('path');

// Load .env file từ thư mục gốc của dự án
// Điều này chủ yếu hữu ích cho môi trường development.
// Trong production, các biến môi trường thường được set trực tiếp trên server/hosting platform.
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Helper function để parse boolean từ string một cách an toàn
const parseBoolean = (value) => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value); // Trả về false cho undefined, null, 0, '', false
};

// Cấu hình Database
// Ưu tiên DATABASE_URL nếu có, nếu không thì sử dụng các biến DB_* riêng lẻ
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT, 10) || 5432;
const dbUser = process.env.DB_USER || 'postgres'; // Mặc định cho local dev
const dbPassword = process.env.DB_PASSWORD || '12345678'; // Mặc định từ .env.example của bạn
const dbDatabase = process.env.DB_DATABASE || 'hotel_management_db';
const dbSsl = parseBoolean(process.env.DB_SSL); // Mặc định là false nếu không được set

let postgresConfig;

if (process.env.DATABASE_URL) {
  postgresConfig = {
    connectionString: process.env.DATABASE_URL,
    // Cố gắng suy ra SSL từ connection string.
    // Cloud providers thường thêm 'ssl=true' hoặc 'sslmode=require' vào connection string.
    ssl: process.env.DATABASE_URL.includes('ssl=true') || process.env.DATABASE_URL.includes('sslmode=require')
      ? { rejectUnauthorized: false } // Thường cần cho cloud DB với self-signed certs hoặc Let's Encrypt
      : false,
  };
} else {
  postgresConfig = {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    // Chỉ áp dụng ssl object nếu dbSsl là true
    ssl: dbSsl ? { rejectUnauthorized: false } : false,
  };
}

// Kiểm tra các biến môi trường quan trọng cho production
// Bạn nên có cơ chế chặt chẽ hơn (ví dụ: dùng Joi và throw error)
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'YourSuperStrongAndVerySecretJWTKeyForHotelApp!@#') {
    console.error("\x1b[31m%s\x1b[0m", "FATAL ERROR: JWT_SECRET is not defined or is using the default example value in production environment. Please set a strong, unique secret.");
    // Để an toàn, bạn nên dừng ứng dụng ở đây: process.exit(1);
  }
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    console.error("\x1b[31m%s\x1b[0m", "FATAL ERROR: Database configuration (DATABASE_URL or DB_HOST) is not defined in production environment.");
    // process.exit(1);
  }
  if (!process.env.CORS_ORIGIN_FE) {
    console.warn("\x1b[33m%s\x1b[0m", "WARNING: CORS_ORIGIN_FE is not defined in production environment. Frontend requests might be blocked by CORS.");
  }
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3002, // Sử dụng port từ .env.example của bạn
  jwt: {
    secret: process.env.JWT_SECRET || 'YourSuperStrongAndVerySecretJWTKeyForHotelApp!@#', // CẢNH BÁO: Giá trị này PHẢI được thay đổi trong production
    accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 10) || 30,
    refreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS, 10) || 30,
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  postgres: postgresConfig, // Thông tin kết nối PostgreSQL
  // URL của Frontend cho CORS, cho phép nhiều origin cách nhau bằng dấu phẩy
  corsOriginFe: process.env.CORS_ORIGIN_FE || 'http://localhost:3000',
};