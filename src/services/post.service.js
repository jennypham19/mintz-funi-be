// src/services/post.service.js

const { Post, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const createPost = async (postBody, authorId) => {
  const { title, content, imageUrl, category, time, authorName } = postBody; 
  if (!title || !content) { /* ... */ }

  const post = await Post.create({
    title,
    content,
    imageUrl,
    category, 
    authorId,
    status: 'pending',
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

const publishPostById = async (postId, publishState) => {
  const post = await getPostById(postId);

  // Chỉ có thể đăng tải bài viết đã được duyệt
  if (post.status !== 'approved') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Chỉ có thể đăng tải các bài viết đã được duyệt.');
  }

  post.isPublished = publishState;
  await post.save();
  return post;
};

const getPublishedPosts = async (queryOptions) => {
  const { page, limit, category } = queryOptions;

  const offset = page * limit;
  const whereConditions = {
    status: 'approved',
    isPublished: true, // Chỉ lấy các bài đã được đăng tải
  };
  if (category !== undefined && category !== 'Tất cả') {
    whereConditions.category = category;
  }
  const {count, rows: posts} = await Post.findAndCountAll({
    where: whereConditions,
    order: [['createdAt', 'DESC']],
    include: { // Thêm thông tin tác giả cho landing page
        model: User,
        as: 'author',
        attributes: ['id', 'fullName', 'avatar_url'],
    },
    limit,
    offset
  });
  const totalPages = Math.ceil(count/limit);
  return {
    totalCount: count,
    totalPages,
    currentPage: page,
    pageSize: limit,
    posts,
  }
};

const getTotalPosts = async (queryOptions) => {
  try {
    const { authorId } = queryOptions;
    const whereConditions = {};
    if (authorId) {
      whereConditions.authorId = authorId;
    }
    const totalPostPending = await Post.count({ where: { ...whereConditions, status: 'pending' }});
    const totalPostApproved = await Post.count({ where: { ...whereConditions, status: 'approved' }});
    return {
      totalPostApproved: totalPostApproved,
      totalPostPending: totalPostPending
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy bản ghi thất bại " + error.message)
  }
}

module.exports = {
  createPost,
  queryPosts,
  getApprovedPosts: getPublishedPosts,
  publishPostById,
  getPostById,
  updatePostById,
  reviewPostById,
  deletePostById,
  getTotalPosts
};