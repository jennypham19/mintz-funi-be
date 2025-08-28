//model/analyticsMetric.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AnalyticsRealtime  extends Model {

    }
    AnalyticsRealtime.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            active_users: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            timestamp: { 
                type: DataTypes.DATE, 
                allowNull: false 
            },
        },
        {
            sequelize,
            modelName: 'AnalyticsRealtime',
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );
    return AnalyticsRealtime;
}