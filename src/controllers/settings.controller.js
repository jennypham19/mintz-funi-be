const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const settingsServices = require('../services/settings.service');
const pick = require('../utils/pick');

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

const deleteSevice = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id)
    await settingsServices.deleteService(id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Xóa dịch vụ thành công'})
})

const getSevice = catchAsync(async (req, res) => {
    const id = parseInt(req.params.id)
    const service = await settingsServices.getServiceById(id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy dịch vụ thành công', data: service})
})

module.exports = {
    uploadSlide,
    getSlides,
    deleteSlide,
    createServices,
    getServices,
    deleteSevice,
    getSevice,
    updateService
}