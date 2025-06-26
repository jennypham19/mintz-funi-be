// src/validations/contact.validation.js
const Joi = require('joi');

const createContact = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().optional().allow(null, ''),
    message: Joi.string().required(),
  }),
};

const getContact = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

// Đánh dấu đã đọc và xóa không cần body
const markAsRead = getContact;
const deleteContact = getContact;

module.exports = {
  createContact,
  getContact,
  markAsRead,
  deleteContact,
};