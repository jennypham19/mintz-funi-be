const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const config = require('../../src/config');
const { User } = require('../../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn chưa đăng nhập, vui lòng đăng nhập để tiếp tục.'));
  }

  const decoded = jwt.verify(token, config.jwt.secret);

  const currentUser = await User.findByPk(decoded.sub, {
    attributes: { exclude: ['password'] },
  });

  if (!currentUser) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Người dùng của token này không còn tồn tại.'));
  }

  req.user = currentUser;
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Bạn không có quyền truy cập vào tài nguyên này.'));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};