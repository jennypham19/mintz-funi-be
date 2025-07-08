const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const tokenService = require('./token.service');
const userService = require('./user.service');


const loginWithUsernameAndPassword = async (username, password) => {
  try {
      const user = await User.findOne({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      if(user.is_deleted === 1) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên');
      }
      return user;
  } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error during login process.');
  }
};

const changePassword = async(updateBody) => {
  const user = await userService.getUserById(updateBody.user_id);
  if (updateBody.password) {
    updateBody.password = await bcrypt.hash(updateBody.password, 10);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
}

const logout = async (refreshToken) => {
    await tokenService.blacklistRefreshToken(refreshToken);
};

module.exports = {
  loginWithUsernameAndPassword,
  changePassword,
  logout
};