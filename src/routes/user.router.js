const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const  userValidation  = require('../validations/user.validation');
const  userController  = require('../controllers/user.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.use(protect);

router
  .route('/create-account')
  .post(
    authorize('admin'),
    upload.single('avatar_url'), 
    validate(userValidation.createUser), 
    userController.createUser
  )

router
  .route('/')
  .get(
    authorize('admin','employee'),
    validate(userValidation.getUsers), 
    userController.getUserDashboard
  )
router
  .route('/get-all-users')
  .get(
    authorize('admin'),
    validate(userValidation.getUsers), 
    userController.getUsers
);

// Chỉ ADMIN mới có quyền xem chi tiết, cập nhật, và xóa user khác
router
  .route('/:id')
  .get(
    authorize('admin'), 
    validate(userValidation.getUser), 
    userController.getUser
  )
router
  .route('/update/:id')
  .put(
    authorize('admin', 'employee'), 
    upload.single('avatar_url'), 
    validate(userValidation.updateUser), 
    userController.updateUser
  );

router
  .route('/reset/:id')
  .patch(
    authorize('admin'), 
    validate(userValidation.getUser), 
    userController.resetUser
  );

router
  .route('/delete/:id')
  .patch(
    authorize('admin'), 
    validate(userValidation.deleteUser), 
    userController.deleteUser
);

router
  .route('/active/:id')
  .patch(
    authorize('admin'), 
    validate(userValidation.deleteUser), 
    userController.activeUser
);

module.exports = router;