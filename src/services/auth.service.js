const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const tokenService = require('./token.service');

const loginWithUsernameAndPassword = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không chính xác');
  }
  return user;
};

module.exports = {
  loginWithUsernameAndPassword,
};