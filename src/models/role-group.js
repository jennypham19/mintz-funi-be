//model/role-group.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleGroup extends Model {
        static associate(models){
            //Một role group có nhiều menu
            RoleGroup.hasMany(models.RoleGroupMenu, {
                foreignKey: 'role_group_id',
                as: 'roleGroupMenu'
            });
            RoleGroup.hasMany(models.RoleGroupAction, {
                foreignKey: 'role_group_id',
                as: 'roleGroupAction'
            });
            RoleGroup.hasMany(models.UserRole, {
                foreignKey: 'role_group_id',
                as: 'roleUser'
            });
        }
    }

    RoleGroup.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'RoleGroup'
        }
    );
    return RoleGroup;
}