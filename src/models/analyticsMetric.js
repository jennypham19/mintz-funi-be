//model/analyticsMetric.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AnalyticsMetric  extends Model {

    }
    AnalyticsMetric.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            property_id: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            page_path: {
                type: DataTypes.STRING,
                allowNull: true
            },
            active_users: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            page_views: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            sessions: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            raw_response: {
                type: DataTypes.JSONB,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'AnalyticsMetric',
            indexes: [
                { fields: ['propertyId', 'date'] },
                { fields: ['pagePath'] }
            ],
        }
    );
    return AnalyticsMetric;
}