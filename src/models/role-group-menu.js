//model/role-group-menu.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleGroupMenu extends Model {
        static associate(models){
            RoleGroupMenu.belongsTo(models.RoleGroup, {
                foreignKey: 'role_group_id',
                as: 'roleGroupMenu'
            });
            RoleGroupMenu.belongsTo(models.Menu, {
                foreignKey: 'menu_id',
                as: 'menu'
            })
        }
    }
    RoleGroupMenu.init(
        {
            role_group_id: DataTypes.INTEGER,
            menu_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'RoleGroupMenu'
        }
    );
    return RoleGroupMenu;
}