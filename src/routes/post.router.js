// src/routes/v1/post.route.js
const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const  postValidation  = require('../validations//post.validation');
const  postController  = require('../controllers/post.controller');

const router = express.Router();

// Route public để lấy các bài viết đã được duyệt
router.get('/public', postController.getPublicPosts);

// Các route dưới đây đều yêu cầu đăng nhập
router.use(protect);

router
  .route('/')
  .post(authorize('employee'), validate(postValidation.createPost), postController.createPost)
  .get(authorize('admin', 'employee'), validate(postValidation.getPosts), postController.getPostsForDashboard);

// Route để admin duyệt bài
router.patch('/:id/review', authorize('admin'), validate(postValidation.reviewPost), postController.reviewPost);

router
  .route('/:id')
  .get(authorize('admin', 'employee'), validate(postValidation.getPost), postController.getPost)
  .patch(authorize('employee'), validate(postValidation.updatePost), postController.updatePost)
  .delete(authorize('admin', 'employee'), validate(postValidation.deletePost), postController.deletePost);

module.exports = router;