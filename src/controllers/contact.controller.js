// src/controllers/contact.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { contactService } = require('../services/contact.service');

const createContact = catchAsync(async (req, res) => {
  const contact = await contactService.createContact(req.body);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Cảm ơn bạn đã liên hệ!', data: contact });
});

const getContacts = catchAsync(async (req, res) => {
  const contacts = await contactService.queryContacts();
  res.status(StatusCodes.OK).send({ success: true, data: contacts });
});

const markContactAsRead = catchAsync(async (req, res) => {
    const contact = await contactService.markContactAsRead(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Đã đánh dấu là đã đọc', data: contact });
});

const deleteContact = catchAsync(async (req, res) => {
    await contactService.deleteContactById(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
});

module.exports = {
  createContact,
  getContacts,
  markContactAsRead,
  deleteContact,
};