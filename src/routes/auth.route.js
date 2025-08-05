const express = require('express');
const validate = require('../middlewares/validate');
const  authValidation  = require('../validations/auth.validation');
const  authController  = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/change-password', validate(authValidation.changePassword), authController.changePassword);
router.post('/refresh-token', authController.refreshToken)

module.exports = router;