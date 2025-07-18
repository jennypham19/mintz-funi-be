// src/routes/v1/permission.route.js
const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const permissionController = require('../controllers/permission.controller');
const validate = require('../middlewares/validate');
const permissionValidation = require('../validations/permission.validation');


const router = express.Router();
router.get('/get-assigned-group-to-user/:id', validate(permissionValidation.getRoleGroupToUser), permissionController.getRoleGroupByUserId)

// Các route dưới đây yêu cầu đăng nhập và có vai trò
router.use(protect, authorize('admin'));

router.get('/menu-with-action', permissionController.getAllModules);

router.post('/create-permission-group', validate(permissionValidation.createRoleGroup), permissionController.createRoleGroup);

router.get('/list-role-groups', permissionController.getAllRoleGroups),

router.post('/assign-group-to-user', validate(permissionValidation.assignRoleGroupToUser), permissionController.assignRoleGroupToUser)



module.exports = router;