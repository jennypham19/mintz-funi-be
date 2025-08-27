// src/services/contact.service.js
const { Contact, Op } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const createContact = async (contactBody) => {
  const { name, email, phone, title, message, captchaCode } = contactBody;
  // Validation cơ bản ở service layer
  if (!name || !email || !message || !phone || !title || !captchaCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng điền các trường Tên, Email, Số điện thoại, Tiêu đề, Nội dung và mã Captcha.');
  }
  return await Contact.create(contactBody);
};

const queryContacts = async (queryOptions) => {
  try {
    const { page, limit, status, searchTerm} = queryOptions;
    const offset = page * limit;
    
    const whereClause = {}
    if(searchTerm){
      whereClause[Op.or] = [
        {name: { [Op.iLike]: `%${searchTerm}%`}},
        {email: { [Op.iLike]: `%${searchTerm}%`}},
        {phone: { [Op.iLike]: `%${searchTerm}%`}},
      ]
    }

    if(status !== undefined && status !== 'all') {
      whereClause.status = status;
    }
    
    const { count, rows: contacts} = await Contact.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['status', 'ASC']]
    })
    const totalPages = Math.ceil(count / limit);
    return {
      contacts,
      totalPages,
      currentPage: page,
      totalContact: count,
    }; 
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy danh sách thất bại " + error.message)
  }
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

const forwardCustomer = async(contactId, updateBody) => {
  const contact = await getContactById(contactId);
  if(!contact) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Không tồn tại thông tin của ${contact.name}`);
  }
  Object.assign(contact, updateBody);
  await contact.save();
  return contact;
}

module.exports = {
  createContact,
  queryContacts,
  getContactById,
  markContactAsRead,
  deleteContactById,
  forwardCustomer
};