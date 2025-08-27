const { AnalyticsMetric, Op } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const overviewTraffic = async (queryOptions) => {
    try {
        const propertyId = process.env.GA_PROPERTY_ID;
        const { from, to } = queryOptions;

        const whereClause = {
            propertyId
        };

        if(from && to){
            whereClause.date = { [Op.between]: [from, to]};
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

module.exports = {
    overviewTraffic
}