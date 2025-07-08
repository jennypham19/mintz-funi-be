'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageSlide extends Model {
        static associate(models) {
        // define association here
        }
    }

    ImageSlide.init({
        name: { type: DataTypes.STRING, allowNull: true},
        url: { type: DataTypes.STRING, allowNull: true}
    }, {
        sequelize,
        modelName: 'ImageSlide',
    });
    return ImageSlide;
}