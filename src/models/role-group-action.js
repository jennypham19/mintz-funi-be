//model/role-group-action.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RoleGroupAction extends Model {
        static associate(models){
            RoleGroupAction.belongsTo(models.RoleGroup, {
                foreignKey: 'role_group_id',
                as: 'roleGroupMenu'
            });
            RoleGroupAction.belongsTo(models.Action, {
                foreignKey: 'action_id',
                as: 'action'
            })
        }
    }
    RoleGroupAction.init(
        {
            role_group_id: DataTypes.INTEGER,
            action_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'RoleGroupAction'
        }
    );
    return RoleGroupAction;
}