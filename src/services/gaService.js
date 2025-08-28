const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const PROPERTY_ID = process.env.GA_PROPERTY_ID;
console.log("path: ",path.join(__dirname,'..', process.env.GA_SERVICE_KEYFILE));


const getJwtClient = () => {
    let key;
    if(process.env.GA_SERVICE_KEYFILE) {
        key = require(path.join(__dirname,'..', process.env.GA_SERVICE_KEYFILE));
    } else if(process.env.GA_SERVICE_KEY_JSON) {
        key = JSON.parse(process.env.GA_SERVICE_KEY_JSON);
    } else {
        throw new Error('Missing GA service account key (GA_SERVICE_KEYFILE or GA_SERVICE_KEY_JSON).');
    }

    const jwt = new google.auth.JWT({
        email: key.client_email,
        key: key.private_key,
        scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });
    return jwt;
}

/**
 * Run a GA4 report for a date range and metrics/dimensions.
 * Returns GA response rows mapped to plain objects.
 *
 * Example usage: getDailyMetrics('2025-08-01', '2025-08-20')
 */

const getDailyMetrics = async (startDate, endDate, options = {}) => {
    const jwt = getJwtClient();
    await jwt.authorize();
    const analyticsData = google.analyticsdata({
        version: 'v1beta',
        auth: jwt
    });

    const requestBody ={
        dateRanges: [{ startDate, endDate }],
        metrics: [
            { name: 'activeUsers'},
            { name: 'screenPageViews'}, // page views
            { name: 'sessions'},
        ],
        dimensions: [{ name: 'date'}],
        // optionally add dimension for pagePath
        // dimensions: [{name:'date'},{name:'pagePath'}]
        ...options.requestBody
    };

    const res = await analyticsData.properties.runReport({
        property: `properties/${PROPERTY_ID}`,
        requestBody
    })

    // parse rows
    const rows = (res.data.rows || []).map(r => {
        const dims = r.dimensionValues || [];
        const mets = r.metricValues || [];
        // assuming dimensions: date
        return {
        date: dims[0] ? dims[0].value : null,
        activeUsers: mets[0] ? parseInt(mets[0].value || '0', 10) : 0,
        pageViews: mets[1] ? parseInt(mets[1].value || '0', 10) : 0,
        sessions: mets[2] ? parseInt(mets[2].value || '0', 10) : 0,
        raw: r
        };
    });

    return rows;
}

module.exports = {
  getDailyMetrics
};