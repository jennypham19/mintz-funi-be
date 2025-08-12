// src/controllers/contact.controller.js
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const contactService  = require('../services/contact.service');
const pick = require('../utils/pick');

const createContact = catchAsync(async (req, res) => {
  const contact = await contactService.createContact(req.body);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Cảm ơn bạn đã liên hệ!', data: contact });
});

const getContacts = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, ['page', 'limit', 'status', 'searchTerm']);
  const contacts = await contactService.queryContacts(queryOptions);
  res.status(StatusCodes.OK).send({ success: true, message: "Lấy danh sách thành công" ,data: contacts });
});

const getContact = catchAsync(async (req, res) => {
  const contact = await contactService.getContactById(req.params.id);
  res.status(StatusCodes.OK).send({ success: true, data: contact });
});

const markContactAsRead = catchAsync(async (req, res) => {
    const contact = await contactService.markContactAsRead(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Đã đánh dấu là đã đọc', data: contact });
});

const deleteContact = catchAsync(async (req, res) => {
    await contactService.deleteContactById(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
});

const forwardContact = catchAsync(async (req, res) => {
  const contact = await contactService.forwardCustomer(req.params.id, req.body);
  res.status(StatusCodes.OK).send({
    success: true,
    message:'Chuyển tiếp thông tin khách hàng thành công',
    data: contact
  })
})

module.exports = {
  createContact,
  getContacts,
  markContactAsRead,
  deleteContact,
  getContact,
  forwardContact
};