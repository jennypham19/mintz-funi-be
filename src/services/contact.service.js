// src/services/contact.service.js

const { Contact } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const createContact = async (contactBody) => {
  const { name, email, message } = contactBody;
  // Validation cơ bản ở service layer
  if (!name || !email || !message) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng điền các trường Tên, Email, và Nội dung.');
  }
  return await Contact.create(contactBody);
};

const queryContacts = async () => {
  return await Contact.findAll({ order: [['createdAt', 'DESC']] });
};

const getContactById = async (contactId) => {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy thông tin liên hệ');
    }
    return contact;
}

const markContactAsRead = async (contactId) => {
  const contact = await getContactById(contactId);
  contact.isRead = true;
  await contact.save();
  return contact;
};

const deleteContactById = async (contactId) => {
  const contact = await getContactById(contactId);
  await contact.destroy();
  return contact;
};

module.exports = {
  createContact,
  queryContacts,
  getContactById,
  markContactAsRead,
  deleteContactById,
};