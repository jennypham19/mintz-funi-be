// src/middlewares/upload.js
const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cấu hình nơi lưu trữ file
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Lưu file vào thư mục `uploads/posts` ở thư mục gốc của dự án
//     cb(null, 'uploads/posts/');
//   },
//   filename: (req, file, cb) => {
//     // Tạo tên file duy nhất: fieldname-timestamp.extension
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// Lưu trực tiếp vào Cloudinary với folder động
const storage = new CloudinaryStorage({
  cloudinary,
  params:(req, file) => {
    // mặc định folder gốc
    let folder = "funi";

    //Nếu gửi lên kèm theo type => tạo folder con theo type
    // ví dụ req.body.type = 'posts' => funi/posts
    if (req.body.type) {
      folder = `${folder}/${req.body.type}`;
    }else {
      console.warn("⚠️ req.body.type missing, fallback to funi/");
    }

    return {
      folder,
      resource_type: "image",                        // fix lỗi resource_type
      use_filename: true,
      unique_filename: true,
    }
  }
})

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, 'Chỉ cho phép upload file ảnh!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Giới hạn 5MB
});

module.exports = upload;