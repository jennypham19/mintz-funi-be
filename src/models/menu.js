//model/menu.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Menu extends Model {
        static associate(models){
            //Một menu có nhiều action
            Menu.hasMany(models.Action, {
                foreignKey: 'menu_id',
                as: 'actions'
            })

            Menu.hasMany(models.RoleGroupMenu, {
                foreignKey: 'menu_id',
                as:'menus'
            })
        }
    }

    Menu.init(
        {
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
            path:{
                type: DataTypes.STRING,
                allowNull: false
            },
            icon: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Menu'
        }
    );
    return Menu;
}