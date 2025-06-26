const jwt = require('jsonwebtoken');
const config = require('../../config/config');

console.log('--- CONFIG OBJECT IN TOKEN.SERVICE.JS ---', config);
console.log('--- JWT OBJECT ---', config.jwt);

const generateAuthToken = (userId, role) => {
  const payload = {
    sub: userId,
    role: role,
    iat: Math.floor(Date.now() / 1000),
  };
  const secret = config.jwt.secret;
  return jwt.sign(payload, secret, { expiresIn: '1d' });
};

module.exports = {
  generateAuthToken,
};