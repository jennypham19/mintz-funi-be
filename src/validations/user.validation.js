const Joi = require('joi');

const createUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    // password: Joi.string().optional(),
    password: Joi.string().required().min(6),
    fullName: Joi.string().required(),
    role: Joi.string().required().valid('admin', 'employee', 'mode'),
    email: Joi.string().optional(),
    address: Joi.string().optional(),
    phone_number: Joi.string().optional(),
    avatar_url: Joi.string().optional(),
    captchaCode: Joi.string().optional(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    role: Joi.string().valid('admin', 'employee', 'mode'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(6), 
    searchTerm: Joi.string().optional(),
    status: Joi.number().integer().optional()
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      fullName: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().optional(),
      email: Joi.string().optional(),
      address: Joi.string().optional(),
      phone_number: Joi.string().optional(),
      avatar_url: Joi.string().optional(),
      captchaCode: Joi.string().optional(),
      // Admin có thể đổi role
      role: Joi.string().valid('admin', 'employee', 'mode'),
    })
    .min(1), // Yêu cầu có ít nhất 1 trường để cập nhật
};

const unactiveUser = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    is_actived: Joi.number().integer().required(),
  })
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  unactiveUser,
  deleteUser
};