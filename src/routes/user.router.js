const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const  userValidation  = require('../validations/user.validation');
const  userController  = require('../controllers/user.controller');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    authorize('admin'), 
    validate(userValidation.createUser), 
    userController.createUser
  )
  .get(
    authorize('admin','employee'),
    validate(userValidation.getUsers), 
    userController.getUserDashboard
  );

// Chỉ ADMIN mới có quyền xem chi tiết, cập nhật, và xóa user khác
router
  .route('/:id')
  .get(
    authorize('admin'), 
    validate(userValidation.getUser), 
    userController.getUser
  )
  .patch(
    authorize('admin'),
    validate(userValidation.updateUser), 
    userController.updateUser
  )
  .delete(
    authorize('admin'),
    validate(userValidation.deleteUser), 
    userController.deleteUser
  );

module.exports = router;