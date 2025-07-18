'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'authorId', as: 'posts' });
      User.hasMany(models.UserRole, {
        foreignKey: 'user_id',
        as:'users'
      })
    }
  }
  User.init({
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('admin', 'employee'),
      allowNull: false,
      defaultValue: 'employee'
    },
    email: { type: DataTypes.STRING, allowNull: true},
    address: { type: DataTypes.STRING, allowNull: true},
    phone_number: { type: DataTypes.STRING, allowNull: true},
    captchaCode: { type: DataTypes.STRING, allowNull: true},
    avatar_url: { type: DataTypes.STRING, allowNull: true},
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_default: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};