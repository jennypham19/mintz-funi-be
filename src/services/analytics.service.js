const { AnalyticsMetric, Op, Sequelize, AnalyticsRealtime } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const dayjs = require("dayjs");
const { fn, col, where } = require('sequelize')

const overviewTraffic = async (queryOptions) => {
    try {
        const propertyId = process.env.GA_PROPERTY_ID;
        const { from, to, pagePath, date } = queryOptions;

        const whereClause = {
            property_id: propertyId
        };

         // nếu có chọn date cụ thể trong select thì ưu tiên
        if(date) {
            whereClause.date = date; // bản ghi đúng ngày được chọn
        }

        // else if(from && to){
        //     // nếu không thì fallback về khoảng ngày mặc định
        //     whereClause.date = { [Op.between]: [from, to]};
        // }

        if(pagePath !== 'ALL' && pagePath !== null) {
            whereClause.page_path = pagePath
        }

        const rows = await AnalyticsMetric.findAll({
            where: whereClause,
            order: [[ 'date', 'ASC']],
            attributes: ['date','active_users','page_views','sessions']
        });

        // transform to arrays for chart
        const data = rows.map(r => ({
            date: r.date,
            activeUsers: r.active_users || 0,
            pageViews: r.page_views || 0,
            sessions: r.sessions || 0
        }));
        return data;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Server error " + error.message)
    }
}

const queryListPagePaths = async(queryOptions) => {
    try {
        const propertyId = process.env.GA_PROPERTY_ID;
        const { from, to, date } = queryOptions;
        const whereClause = {
            property_id: propertyId
        };
         // nếu có chọn date cụ thể trong select thì ưu tiên
        if(date) {
            whereClause.date = date; // bản ghi đúng ngày được chọn
        }

        // if(from && to){
        //     whereClause.date = { [Op.between]: [from, to]};
        // }

        const paths = await AnalyticsMetric.findAll({
            where: whereClause,
            attributes: [
                'page_path',
                'page_title'
            ],
            group: ['page_path', 'page_title'],
            order: [['page_path','ASC']]
        });
        const result = paths.map(p => p.page_path).filter(Boolean);
        return paths
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy danh sách thất bại: " + error.message)
    }
}

const overviewRealtime = async() => {
    try {
        const date = dayjs().format("YYYY-MM-DD"); 
        const data = await AnalyticsRealtime.findAll({
            where: where(fn("DATE", col("timestamp")), date),
            order: [["timestamp", "ASC"]],
        })
        return data        
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy danh sách thất bại: " + error.message)
    }

}

module.exports = {
    overviewTraffic,
    queryListPagePaths,
    overviewRealtime
}