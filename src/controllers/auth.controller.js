const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginWithUsernameAndPassword(username, password);
  const token = tokenService.generateAuthToken(user.id, user.role);

  // Gửi token qua cookie để bảo mật hơn (httpOnly)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS ở môi trường production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // Xóa mật khẩu trước khi gửi về cho client
  user.password = undefined;

  res.status(StatusCodes.OK).send({
    success: true,
    message: 'Đăng nhập thành công',
    data: { user, token }, // Gửi cả token trong data để client có thể lưu vào state nếu cần
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie('token');
  res.status(StatusCodes.OK).send({ success: true, message: 'Đăng xuất thành công' });
});

const getMe = catchAsync(async (req, res) => {
  // Thông tin user đã được middleware 'protect' lấy và gán vào req.user
  const user = req.user;
  res.status(StatusCodes.OK).send({ success: true, data: user });
});


module.exports = {
  login,
  logout,
  getMe
};