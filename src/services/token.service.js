// src/services/token.service.js

const jwt = require('jsonwebtoken');
const moment = require('moment'); // Cần cài đặt: npm install moment
const { StatusCodes } = require('http-status-codes');
const config = require('../config');
const { Token, User } = require('../models'); 
const { tokenTypes } = require('../config/tokens');
const ApiError = require('../utils/ApiError');


const generateToken = (userId, role, secret, expiresIn) => {
  const payload = {
    sub: userId,
    role: role,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, secret, { expiresIn });
};


const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const createdToken = await Token.create({
    token,
    userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return createdToken;
};

const verifyToken = async (token, type) => {
  const secret = type === tokenTypes.REFRESH ? config.jwt.refreshSecret : config.jwt.secret;
  
  try {
    const payload = jwt.verify(token, secret);
    
    const tokenDoc = await Token.findOne({
      where: { token, type, userId: payload.sub, blacklisted: false },
    });

    if (!tokenDoc) {
      throw new Error('Token not found in DB');
    }
    return tokenDoc;
  } catch (error) {

    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token is not valid');
  }
};

const generateAuthTokens = async (user) => {
  console.log("config: ", config);
  
  const accessTokenExpiresIn = `${config.jwt.accessExpirationMinutes}m`;
  const refreshTokenExpiresIn = `${config.jwt.refreshExpirationDays}d`;
  
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');

  const accessToken = generateToken(user.id, user.role, config.jwt.secret, accessTokenExpiresIn);
  const refreshToken = generateToken(user.id, user.role, config.jwt.refreshSecret, refreshTokenExpiresIn);

  // Lưu refresh token vào database
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    accessToken: { token: accessToken, expires: accessTokenExpires.toDate() },
    refreshToken: { token: refreshToken, expires: refreshTokenExpires.toDate() },
  };
};

/**
 * Làm mới access token bằng refresh token.
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await User.findByPk(refreshTokenDoc.userId);
    if (!user) {
      throw new Error('User not found');
    }
    // Xóa refresh token cũ đi để đảm bảo mỗi refresh token chỉ được dùng một lần (tăng bảo mật)
    await refreshTokenDoc.destroy();
    // Tạo cặp token mới
    return await generateAuthTokens(user);
  } catch (error) {
    // Nếu verifyToken hoặc bất cứ thứ gì khác thất bại
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Please authenticate');
  }
};

const blacklistRefreshToken = async (refreshToken) => {
  const tokenDoc = await Token.findOne({
    where: {
      token: refreshToken,
      type: tokenTypes.REFRESH 
    }
  });
  if (!tokenDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Refresh token not found');
  }
  tokenDoc.blacklisted = true;
  await tokenDoc.save();
  return tokenDoc; 
}; 

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  refreshAuth,
  blacklistRefreshToken
};