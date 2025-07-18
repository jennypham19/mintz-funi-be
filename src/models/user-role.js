//model/user-role.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserRole extends Model {
        static associate(models){
            UserRole.belongsTo(models.RoleGroup, {
                foreignKey: 'role_group_id',
                as: 'roleGroup'
            });
            UserRole.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            })
        }
    }
    UserRole.init(
        {
            role_group_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'UserRole'
        }
    );
    return UserRole;
}