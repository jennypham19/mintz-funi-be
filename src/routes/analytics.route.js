const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const analyticsController = require('../controllers/analytics.controller');

const router = express.Router();

// Các route dưới đây yêu cầu đăng nhập và có vai trò
router.use(protect, authorize('admin', 'employee', 'mode'));

router.get('/overview', analyticsController.overview);

router.get('/page-paths', analyticsController.getListPathPages);

router.get('/realtime', analyticsController.getOverviewRealtime);

module.exports = router;