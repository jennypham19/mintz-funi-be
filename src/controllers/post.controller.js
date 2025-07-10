// src/controllers/post.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const postService = require('../services/post.service');
const pick = require('../utils/pick');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body, req.user.id);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo bài viết thành công, đang chờ duyệt.', data: post });
});

const getPosts = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, ['page', 'limit', 'status', 'authorId']);
  const result = await postService.queryPosts(queryOptions);
  res.status(StatusCodes.OK).send({ success: true, data: result });

});

const getPublicPosts = catchAsync(async (req, res) => {
  const posts = await postService.getApprovedPosts();
  res.status(StatusCodes.OK).send({ success: true, data: posts });
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  res.status(StatusCodes.OK).send({ success: true, data: post });
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePostById(req.params.id, req.body, req.user);
  res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bài viết thành công.', data: post });
});

const reviewPost = catchAsync(async (req, res) => {
  const post = await postService.reviewPostById(req.params.id, req.body);
  res.status(StatusCodes.OK).send({ success: true, message: 'Duyệt bài viết thành công.', data: post });
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.id, req.user);
  res.status(StatusCodes.NO_CONTENT).send();
});

const uploadPostImage = catchAsync(async (req, res) => {
  if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng chọn một file để upload.');
  }
  const imageUrl = `/uploads/posts/${req.file.filename}`;
  res.status(StatusCodes.OK).send({ success: true, message: 'Upload ảnh thành công', data: { imageUrl } });
});

const publishPost = catchAsync(async (req, res) => {
  // `publishState` được gửi lên từ body, ví dụ: { publish: true }
  const { publish } = req.body; 
  const post = await postService.publishPostById(req.params.id, publish);
  const message = publish ? 'Đăng tải bài viết thành công.' : 'Hủy đăng tải bài viết thành công.';
  res.status(StatusCodes.OK).send({ success: true, message, data: post });
});


module.exports = {
  createPost,
  getPosts,
  getPublicPosts,
  getPostById,
  updatePost,
  reviewPost,
  deletePost,
  uploadPostImage,
  publishPost,
};