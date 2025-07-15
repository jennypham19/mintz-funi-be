const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const settingsValidation = require('../validations/settings.validation');
const settingsController = require('../controllers/settings.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Lấy danh sách ảnh, Route này là public, không cần đăng nhập
router
    .route('/image-slides')
    .get(
        validate(settingsValidation.getSlides),
        settingsController.getSlides
    )
router
    .route('/services')
    .get(
        validate(settingsValidation.getServices),
        settingsController.getServices
    )
router
    .route('/design-and-builds')
    .get(
        validate(settingsValidation.getDesignAndBuilds),
        settingsController.getDesignAndBuilds
    )

// Các route dưới đây yêu cầu đăng nhập và có vai trò
router.use(protect, authorize('admin'));

//Lưu ảnh
router
    .route('/upload-image')
    .post(
        upload.single('url'),
        validate(settingsValidation.uploadSlide),
        settingsController.uploadSlide
    )

// Xóa ảnh
router
    .route('/delete-image/:id')
    .delete(
        validate(settingsValidation.getSlide),
        settingsController.deleteSlide
    )
    
//Lưu dịch vụ
router
    .route('/create-service')
    .post(
        upload.single('image_url'),
        validate(settingsValidation.bodyService),
        settingsController.createServices
    )

//Cập nhật dịch vụ
router
    .route('/update-service/:id')
    .put(
        upload.single('image_url'),
        validate(settingsValidation.updateService),
        settingsController.updateService
    )

// Xóa dịch vụ
router
    .route('/delete-service/:id')
    .delete(
        validate(settingsValidation.getService),
        settingsController.deleteService
    )

// Lấy chi tiết dịch vụ
router
    .route('/service/:id')
    .get(
        validate(settingsValidation.getService),
        settingsController.getService
    )

// Lưu quy trình thiết kế và thi công
router
    .route('/create-design-and-build')
    .post(
        upload.single('image_url'),
        validate(settingsValidation.bodyDesignAndBuild),
        settingsController.createDesignAndBuild
    )

// Lấy chi tiết thiết kế & thi công
router
    .route('/design-and-build/:id')
    .get(
        validate(settingsValidation.getDesignAndBuild),
        settingsController.getDesignAndBuild
    )

//Cập nhật thiết kế & thi công
router
    .route('/update-design-and-build/:id')
    .put(
        upload.single('image_url'),
        validate(settingsValidation.updateDesignAndBuild),
        settingsController.updateDesignAndBuild
    )

// Xóa thiết kế & thi công
router
    .route('/delete-design-and-build/:id')
    .delete(
        validate(settingsValidation.getDesignAndBuild),
        settingsController.deleteDesignAndBuild
    )
module.exports = router;