const cron = require('node-cron');
const gaService = require('../services/gaService');
const { AnalyticsMetric } = require('../models');


const isoDateMinusDays = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0,10);
}

// job: fetch last N days (default 7) and upsert into DB
const fetchAndStoreLastNDays = async(n = 1) => {
    const end = isoDateMinusDays(0);
    const startDate = isoDateMinusDays(n);
    try {
        const rows = await gaService.getDailyMetrics(startDate, end);
        for (const r of rows) {
            await AnalyticsMetric.upsert({
                property_id: process.env.GA_PROPERTY_ID,
                date: r.date,
                active_users: r.activeUsers,
                page_views: r.pageViews,
                sessions: r.sessions,
                raw_response: r.raw
            }, {
                where: { property_id: process.env.GA_PROPERTY_ID, date: r.date}
            });
        }
        console.log(`GA metrics synced for ${startDate}..${end}: ${rows.length} rows`);
    } catch (error) {
        console.error('Error fetching GA metrics', error);
    }
}

// schedule job
const startCron = () => {
    cron.schedule('*/1 * * * *', () => {
        console.log('Running GA fetch job at', new Date().toISOString());
        fetchAndStoreLastNDays(7).catch(console.error);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    })
}

module.exports = { startCron, fetchAndStoreLastNDays };