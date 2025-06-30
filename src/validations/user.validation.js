const Joi = require('joi');

const createUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
    fullName: Joi.string().required(),
    role: Joi.string().required().valid('admin', 'employee'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    role: Joi.string().valid('admin', 'employee'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(6), 
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
      fullName: Joi.string(),
      password: Joi.string().min(6),
      // Admin có thể đổi role
      role: Joi.string().valid('admin', 'employee'),
    })
    .min(1), // Yêu cầu có ít nhất 1 trường để cập nhật
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
  deleteUser,
};