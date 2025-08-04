const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const config = require('../config');

const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginWithUsernameAndPassword(username, password);
  const tokens = await tokenService.generateAuthTokens(user);

  // Gửi refreshToken qua cookie httpOnly để tăng cường bảo mật
  res.cookie('refreshToken', tokens.refreshToken.token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'None' : 'Lax',
    maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000, // maxAge tính bằng mili giây
  });

  // Xóa mật khẩu trước khi gửi về client
  user.password = undefined;

  // Trả về response đúng như cấu trúc frontend cần
  res.status(StatusCodes.OK).send({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      user,
      accessToken: tokens.accessToken.token,
      refreshToken: tokens.refreshToken.token,
    },
  });
});

const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  res.clearCookie('refreshToken');
  res.status(StatusCodes.NO_CONTENT).send();
});

const refreshToken = catchAsync(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy refresh token');
  }

  const newTokens = await tokenService.refreshAuth(oldRefreshToken);

  res.cookie('refreshToken', newTokens.refreshToken.token, {
    httpOnly: true,
    secure: config.env === 'production',
    maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
  });

  // Chỉ trả về access token mới
  res.status(StatusCodes.OK).send({
    success: true,
    data: {
      accessToken: newTokens.accessToken.token,
    },
  });
});

const getMe = catchAsync(async (req, res) => {
  // Thông tin user đã được middleware 'protect' lấy và gán vào req.user
  const user = req.user;
  res.status(StatusCodes.OK).send({ success: true, data: user });
});

const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.body);
  res.status(StatusCodes.OK).send({success: true, message: 'Thay đổi mật khẩu thành công'})
})


module.exports = {
  login,
  logout,
  refreshToken,
  getMe,
  changePassword
};