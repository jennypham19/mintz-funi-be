const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const settingsServices = require('../services/settings.service');
const pick = require('../utils/pick');


//slide
const uploadSlide = catchAsync(async(req, res) => {
    const file = req.file;
    const slide = await settingsServices.uploadImageSlide(req.body, file);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lưu ảnh thành công', data: slide})
});

const getSlides = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'size', 'searchTerm']);
    const slides = await settingsServices.getImageSlides(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: slides})
})

const deleteSlide = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id)
    await settingsServices.deleteImageSlide(id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Xóa ảnh thành công'})
})

//services
const createServices = catchAsync(async (req, res) => {
    const file = req.file;
    const service = await settingsServices.createImageServices(req.body, file);
    res.status(StatusCodes.OK).send({ success: true, message: 'Thêm dịch vụ thành công', data: service})
})

const updateService = catchAsync(async (req, res) => {
    const file = req.file;
    const id = parseInt(req.params.id)
    const service = await settingsServices.updateService(id, req.body, file);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật dịch vụ thành công', data: service})
})

const getServices = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'size', 'searchTerm']);
    const services = await settingsServices.getServices(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: services})
})

const deleteService = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id)
    await settingsServices.deleteService(id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Xóa dịch vụ thành công'})
})

const getService = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id)
    const service = await settingsServices.getServiceById(id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy dịch vụ thành công', data: service})
})

//design & build
const createDesignAndBuild = catchAsync(async (req, res) => {
    const file = req.file;
    const designAndBuild = await settingsServices.createImageDesignAndBuild(req.body, file);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lưu thành công', data: designAndBuild})
})

const getDesignAndBuilds = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'size', 'searchTerm']);
    const designAndBuilds = await settingsServices.getDesignAndBuilds(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: designAndBuilds})
})

const getDesignAndBuild = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id)
    const service = await settingsServices.getDesignAndBuildById(id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy bản ghi thành công', data: service})
})

const updateDesignAndBuild = catchAsync(async (req, res) => {
    const file = req.file;
    const id = parseInt(req.params.id)
    const designAndBuild = await settingsServices.updateDesignAndBuild(id, req.body, file);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bản ghi thành công', data: designAndBuild})
})

const deleteDesignAndBuild = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id)
    await settingsServices.deleteDesignAndBuild(id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Xóa bản ghi thành công'})
})

module.exports = {
    uploadSlide,
    getSlides,
    deleteSlide,
    createServices,
    getServices,
    deleteService,
    getService,
    updateService,
    createDesignAndBuild,
    getDesignAndBuilds,
    getDesignAndBuild,
    updateDesignAndBuild,
    deleteDesignAndBuild
}