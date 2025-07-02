const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    is_default: Joi.number().optional(),
    user_id: Joi.number().integer().optional()
  }),
};

module.exports = {
  login,
  changePassword
};