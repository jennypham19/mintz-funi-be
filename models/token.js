// src/models/token.js
'use strict';
const { Model } = require('sequelize');
const { tokenTypes } = require('../src/config/tokens');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
      Token.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Token.init({
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD]],
      },
    },
    expires: { type: DataTypes.DATE, allowNull: false },
    blacklisted: { type: DataTypes.BOOLEAN, defaultValue: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};