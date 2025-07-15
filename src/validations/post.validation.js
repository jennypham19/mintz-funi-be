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
    imageUrl: Joi.string().required().messages({
        'string.empty': 'Đường dẫn ảnh không được để trống.',
        'any.required': 'Đường dẫn ảnh là bắt buộc.',
    }),

    category: Joi.string().required().messages({
        'string.empty': 'Thể loại không được để trống.',
        'any.required': 'Thể loại là trường bắt buộc.',
    }),
    time: Joi.string().isoDate().required().messages({ 
        'string.empty': 'Thời gian không được để trống.',
        'any.required': 'Thời gian là trường bắt buộc.',
        'date.isoDate': 'Định dạng thời gian không hợp lệ.',
    }),
    authorName: Joi.string().required().messages({
        'string.empty': 'Tên tác giả không được để trống.',
        'any.required': 'Tên tác giả là trường bắt buộc.',
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
    id: Joi.number().required(),    
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
    category: Joi.string(),
    time: Joi.date().iso(), 
    authorName: Joi.string().allow(''),
    imageUrl: Joi.string().allow(null, ''),
  }),
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

const publishPost = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    publish: Joi.boolean().required(),
  }),
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
  publishPost,
  deletePost,
};