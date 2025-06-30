// src/services/post.service.js

const { Post, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

/**
 * Tạo một bài viết mới với trạng thái 'pending'
 * @param {Object} postBody - Dữ liệu bài viết từ request body
 * @param {number} authorId - ID của nhân viên tạo bài
 * @returns {Promise<Post>}
 */
const createPost = async (postBody, authorId) => {
  const { title, content } = postBody;
  if (!title || !content) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tiêu đề và nội dung không được để trống.');
  }
  const post = await Post.create({
    title,
    content,
    authorId,
    status: 'pending', // Mặc định khi tạo là chờ duyệt
  });
  return post;
};

const queryPosts = async (queryOptions) => {
  const { page, limit, status, authorId } = queryOptions;
  const offset = (page - 1) * limit;

  const whereConditions = {};
  if (status) {
    whereConditions.status = status;
  }
  if (authorId) {
    whereConditions.authorId = authorId;
  }

  const { count, rows: posts } = await Post.findAndCountAll({
    where: whereConditions,
    limit,
    offset,
    include: {
        model: User,
        as: 'author',
        attributes: ['id', 'fullName'],
    },
    order: [['createdAt', 'DESC']],
  });
  
  const totalPages = Math.ceil(count / limit);

  return {
    posts,
    totalPages,
    currentPage: page,
    totalPosts: count,
  };
};

const getApprovedPosts = async () => {
  const posts = await Post.findAll({
    where: { status: 'approved' },
    order: [['createdAt', 'DESC']],
  });
  return posts;
};

const getPostById = async (postId) => {
  const post = await Post.findByPk(postId, {
    include: {
        model: User,
        as: 'author',
        attributes: ['id', 'fullName'],
    }
  });
  if (!post) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy bài viết');
  }
  return post;
};

const updatePostById = async (postId, updateBody, currentUser) => {
  const post = await getPostById(postId);

  if (post.authorId !== currentUser.id) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn chỉ có thể sửa bài viết của chính mình.');
  }

  // Chỉ cho phép sửa khi bài viết đang ở trạng thái 'pending' hoặc 'rejected'
  if (post.status === 'approved') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Không thể sửa bài viết đã được duyệt.');
  }

  Object.assign(post, updateBody);
  // Khi nhân viên sửa lại bài, trạng thái sẽ quay về 'pending' để chờ duyệt lại
  post.status = 'pending';
  post.rejectionReason = null;
  await post.save();
  return post;
};

const reviewPostById = async (postId, reviewBody) => {
    const post = await getPostById(postId);
    const { status, rejectionReason } = reviewBody;

    post.status = status;
    if(status === 'rejected') {
        post.rejectionReason = rejectionReason;
    } else {
        post.rejectionReason = null; // Xóa lý do từ chối nếu bài được duyệt
    }

    await post.save();
    return post;
}

const deletePostById = async (postId, currentUser) => {
  const post = await getPostById(postId);

  // Chỉ chủ bài viết hoặc admin mới có quyền xóa
  if (post.authorId !== currentUser.id && currentUser.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền xóa bài viết này.');
  }

  await post.destroy();
  return post;
};

module.exports = {
  createPost,
  queryPosts,
  getApprovedPosts,
  getPostById,
  updatePostById,
  reviewPostById,
  deletePostById,
};