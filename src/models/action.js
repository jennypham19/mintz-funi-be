//model/menu.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Action extends Model {
        static associate(models) {
            Action.belongsTo(models.Menu, {
                foreignKey: 'menu_id',
                as: 'menu'
            });
            Action.hasMany(models.RoleGroupAction, {
                foreignKey: 'action_id',
                as:'actions'
            })
        }
    }
    Action.init(
        {
            menu_id: DataTypes.INTEGER,
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate:{ notEmpty: true }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Action'
        }
    );
    return Action;
}