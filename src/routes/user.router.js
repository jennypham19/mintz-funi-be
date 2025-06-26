const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const  userValidation  = require('../validations/user.validation');
const  userController  = require('../controllers/user.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:id')
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;