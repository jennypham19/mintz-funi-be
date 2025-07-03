// src/routes/v1/contact.route.js
const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const contactValidation = require('../validations/contact.validation');
const contactController = require('../controllers/contact.controller');

const router = express.Router();

// Route này là public, không cần đăng nhập
router.post('/send', validate(contactValidation.createContact), contactController.createContact);

// Các route dưới đây yêu cầu đăng nhập và có vai trò
router.use(protect, authorize('admin', 'employee'));

router.get('/', validate(contactValidation.getContacts), contactController.getContacts);

//Lấy chi tiết
router.get('/:id', validate(contactValidation.getContact), contactController.getContact);

// Đánh dấu đã đọc
router.patch('/:id/read', validate(contactValidation.markAsRead), contactController.markContactAsRead);

// Xóa
router.delete('/:id', validate(contactValidation.deleteContact), contactController.deleteContact);


module.exports = router;