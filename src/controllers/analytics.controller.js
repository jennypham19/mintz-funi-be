const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const analyticsService  = require('../services/analytics.service');
const pick = require('../utils/pick');

const overview = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['from', 'to', 'pagePath']);
      const data = await analyticsService.overviewTraffic(queryOptions);
      res.status(StatusCodes.OK).send({ success: true, message: "Lấy dữ liệu thành công" ,data: data });
})

const getListPathPages = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['from', 'to']);
      const data = await analyticsService.queryListPagePaths(queryOptions);
      res.status(StatusCodes.OK).send({ success: true, message: "Lấy dữ liệu thành công" ,data: data });
})

const getOverviewRealtime = catchAsync(async (req,res) => {
  const data = await analyticsService.overviewRealtime();
  res.status(StatusCodes.OK).send({ success: true, message: "Lấy dữ liệu thành công" ,data: data });
})

module.exports = {
    overview,
    getListPathPages,
    getOverviewRealtime
}