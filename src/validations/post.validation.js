// src/validations/post.validation.js
const Joi = require('joi');

const createPost = {
  body: Joi.object().keys({
    title: Joi.string().required().messages({
      'string.empty': 'Tiêu đề không được để trống.',
      'any.required': 'Tiêu đề là trường bắt buộc.',
    }),
    content: Joi.string().required().messages({
      'string.empty': 'Nội dung không được để trống.',
      'any.required': 'Nội dung là trường bắt buộc.',
    }),
  }),
};

const getPosts = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    authorId: Joi.number().integer(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(2),
  }),
};

const getPost = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      content: Joi.string(),
    })
    .min(1), // Phải có ít nhất 1 trường để cập nhật
};

const reviewPost = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().required().valid('approved', 'rejected'),
      rejectionReason: Joi.string().when('status', {
        is: 'rejected',
        then: Joi.string().required().messages({
          'string.empty': 'Lý do từ chối không được để trống.',
          'any.required': 'Vui lòng cung cấp lý do từ chối.',
        }),
        otherwise: Joi.optional().allow(null, ''),
      }),
    })
    .min(1),
};

const deletePost = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  reviewPost,
  deletePost,
};