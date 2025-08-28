const cron = require('node-cron');
const gaService = require('../services/gaService');
const { AnalyticsMetric, AnalyticsRealtime } = require('../models');


const isoDateMinusDays = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0,10);
}

// job: fetch last N days (default 7) and upsert into DB
const fetchAndStoreLastNDays = async(n = 7) => {
    const end = isoDateMinusDays(0);
    const startDate = isoDateMinusDays(n);
    // const end = dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
    // const startDate = dayjs().tz('Asia/Ho_Chi_Minh').subtract(n - 1, 'day').format('YYYY-MM-DD');
    try {
        const rows = await gaService.getDailyMetrics(startDate, end);
        for (const r of rows) {
            await AnalyticsMetric.upsert({
                property_id: process.env.GA_PROPERTY_ID,
                date: r.date,
                page_path: r.pagePath,
                active_users: r.activeUsers,
                page_views: r.pageViews,
                sessions: r.sessions,
                raw_response: r.raw
            }, {
                where: { property_id: process.env.GA_PROPERTY_ID, date: r.date, page_path: r.pagePath}
            });
        }
        console.log(`GA metrics synced for ${startDate}..${end}: ${rows.length} rows`);
    } catch (error) {
        console.error('Error fetching GA metrics', error);
    }
}

const fetchAndStoreRealtime = async(n=1) => {
    const date = isoDateMinusDays(n);
    try {
        const rows = await gaService.getRealtimeUsers(date);
        for(const r of rows) {
            await AnalyticsRealtime.upsert({
                active_users: r.activeUsers,
                timestamp: r.timestamp
            })
        }
    } catch (error) {
        console.error('Error fetching GA realtime', error);
    }
}

// schedule job: chạy mỗi ngày lúc 2h sáng theo giờ Việt Nam
const startCron = () => {
    cron.schedule('0 2 * * *', () => {
        console.log('Running GA fetch job at', new Date().toISOString());
        fetchAndStoreLastNDays(7).catch(console.error);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    })
}

const startCronRealtime = () => {
    cron.schedule('*/10 * * * *', () => {
        fetchAndStoreRealtime(1).catch(console.error);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh" 
    })
}

module.exports = { startCron, fetchAndStoreLastNDays, startCronRealtime, fetchAndStoreRealtime };