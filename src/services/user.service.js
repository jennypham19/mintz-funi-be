const { User, Op } = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const uploadService = require('./upload-image.service');
const mailService = require('../services/mail.service');
const { getWelcomeEmailTemplate } = require('../utils/emailTemplates')

const isUsernameTaken = async (username) => {
  const user = await User.findOne({ where: { username } });
  return !!user;
};

const createUserService = async (userBody, file) => {
  if (await isUsernameTaken(userBody.username)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên đăng nhập đã được sử dụng.');
  }
  if(file){
    const fileSize = file.size;
    const maxSize = 10 * 1024 * 1024;
    if(fileSize > maxSize){
      throw new ApiError(StatusCodes.BAD_REQUEST,"Image size exceeds 10MB limit")
    }
      const avatarUrl = await uploadService.uploadAvatar(file);
      userBody.avatar_url = avatarUrl;
  }
  // Tự sinh password ngẫu nhiên dài 8 ký tự
  const plainPassword = crypto.randomBytes(6).toString('base64').slice(0,6);
  // Hash bằng bcrypt
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const user = await User.create({ ...userBody, password: hashedPassword, is_default: 1 });
  // user.password = undefined; // Không trả về password
  await mailService.sendMail({
    to: userBody.email,
    subject: 'Thông tin đăng nhập hệ thống Mintz',
    text: `Xin chào ${userBody.username}, mật khẩu tạm của bạn là: ${plainPassword}`,
    html: getWelcomeEmailTemplate(userBody.fullName, userBody.username, plainPassword, 'http://localhost:3000/auth/login')
  })
  const newUser = user.toJSON();
  const userReturn = {
    ...newUser,
    password: plainPassword
  }
  
  return userReturn;
  
};

const getAllUsers = async ({ page, size, filter}) => {
    // filter có thể là { role: 'employee' }
    try {
      const offset = page * size;
      const {count, rows: users} = await User.findAndCountAll({
          where: filter,
          attributes: { exclude: ['password'] },
          order: [
            ['is_deleted', 'ASC'],
          ],
          limit: size,
          offset
      });
      const totalPages = Math.ceil(count/size);
      return {
        totalCount: count,
        totalPages,
        currentPage: page,
        pageSize: size,
        data: users,
      }
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Get all list users is failed " + error.message);
    }

}

const getUserById = async (id) => {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    // const user = await User.findByPk(id);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng');
    }
    return user;
}

const updateUserById = async (userId, updateBody, file) => {
    const user = await getUserById(userId);
    // if (updateBody.password) {
    //     updateBody.password = await bcrypt.hash(updateBody.password, 10);
    // }
    // Object.assign(user, updateBody);
    if(file){
      const fileSize = file.size;
      const maxSize = 10 * 1024 * 1024;
      if(fileSize > maxSize){
        throw new ApiError(StatusCodes.BAD_REQUEST,"Image size exceeds 10MB limit")
      }
        const avatarUrl = await uploadService.uploadAvatar(file);
        updateBody.avatar_url = avatarUrl;
    }
    await user.update(updateBody);
    await user.reload();
    return user;
}


const deleteUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const queryUsers = async (queryOptions, currentUserId) => {
  const { page, limit, role } = queryOptions;
  const offset = (page - 1) * limit;

  const whereConditions = {
    id: { [Op.ne]: currentUserId }, 
  };

  if (role) {
    whereConditions.role = role;
  }
  
  const { count, rows: users } = await User.findAndCountAll({
    where: whereConditions,
    limit,
    offset,
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
  
  const totalPages = Math.ceil(count / limit);

  return {
    users,
    totalPages,
    currentPage: page,
    totalUsers: count,
  };
};


module.exports = {
  createUserService,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  queryUsers,
};