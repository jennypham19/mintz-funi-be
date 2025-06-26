// src/controllers/post.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { postService } = require('../services/post.service');

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body, req.user.id);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo bài viết thành công, đang chờ duyệt.', data: post });
});

const getPostsForDashboard = catchAsync(async (req, res) => {
  const posts = await postService.queryPostsForDashboard();
  res.status(StatusCodes.OK).send({ success: true, data: posts });
});

const getPublicPosts = catchAsync(async (req, res) => {
    const posts = await postService.getApprovedPosts();
    res.status(StatusCodes.OK).send({ success: true, data: posts });
});

const getPost = catchAsync(async (req, res) => {
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

module.exports = {
  createPost,
  getPostsForDashboard,
  getPublicPosts,
  getPost,
  updatePost,
  reviewPost,
  deletePost,
};