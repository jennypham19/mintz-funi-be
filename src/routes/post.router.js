// src/routes/post.route.js
const express = require('express');

const { protect, authorize } = require('../middlewares/auth');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const postValidation = require('../validations/post.validation');
const postController = require('../controllers/post.controller');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/public', postController.getPublicPosts);
router.get('/total-post', validate(postValidation.getTotalPost), postController.getTotalPosts);

router.use(protect);

router.post(
  '/upload-image',
  authorize('employee'),
  upload.single('image'),
  postController.uploadPostImage
);

router
  .route('/')
  .post(authorize('employee'), validate(postValidation.createPost), postController.createPost)
  .get(authorize('admin', 'employee'), validate(postValidation.getPosts), postController.getPosts);


router.patch(
  '/:id/review',
  authorize('admin'),
  validate(postValidation.reviewPost),
  postController.reviewPost
);

router
  .route('/:id')
  .get(authorize('admin', 'employee'), validate(postValidation.getPost), postController.getPostById)
  .patch(authorize('employee'), validate(postValidation.updatePost), postController.updatePost)
  .delete(authorize('admin', 'employee'), validate(postValidation.deletePost), postController.deletePost);

router
  .route('/:id/publish')
  .patch(authorize('employee'), validate(postValidation.publishPost), postController.publishPost);

router.get('/public', postController.getPublicPostsLandingPage);

module.exports = router;