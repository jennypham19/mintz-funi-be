'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DesignAndBuild extends Model {
        static associate(models) {
            // define association here
        }
    }

    DesignAndBuild.init({
        title: { type: DataTypes.STRING, allowNull: true},
        image_url: { type: DataTypes.STRING, allowNull: true},
        content: { type: DataTypes.STRING, allowNull: true}
    }, {
        sequelize,
        modelName: 'DesignAndBuild'
    });
    return DesignAndBuild;
}