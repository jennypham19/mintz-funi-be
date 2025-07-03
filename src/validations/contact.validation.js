// src/validations/contact.validation.js
const Joi = require('joi');

const getContacts = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(12), 
    searchTerm: Joi.string().optional(),
  }),
};

const createContact = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().optional().allow(null, ''),
    title: Joi.string().required(),
    message: Joi.string().required(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    isRead: Joi.number().integer().required()
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
  getContacts
};