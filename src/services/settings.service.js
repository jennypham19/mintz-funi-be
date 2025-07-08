const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const uploadService = require('./upload-image.service');
const { ImageSlide, Op, Service } = require('../models');
const path = require('path');
const fs = require('fs');

const getImageSlidesById = async(id) => {
    const slide = await ImageSlide.findByPk(id);
    if(!slide){
        throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy ảnh");
    }
    return slide;
}

const getServiceById = async(id) => {
    const serive = await Service.findByPk(id);
    if(!serive){
        throw new ApiError(StatusCodes.NOT_FOUND,  "Không tìm thấy dịch vụ");
    }
    return serive;
}

const uploadImageSlide = async(slideBody, file) => {
    try {
        if(file){
            const fileSize = file.size;
            const maxSize = 10 * 1024 * 1024;
            if(fileSize > maxSize){
                throw new ApiError(StatusCodes.BAD_REQUEST, "Image size exceed 10MB limit")
            }
            const urlSlide = await uploadService.uploadImageSlide(file);
            slideBody.url = urlSlide;
            const slide = await ImageSlide.create(slideBody);
            return slide;
        }  
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lưu ảnh thất bại " + error.message);
    }
}

const getImageSlides = async(queryOptions) => {
    try {
        const { page, size, searchTerm} = queryOptions;
        const offset = page * size;
        const whereClause = {};
        if(searchTerm){
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchTerm}%`}}
            ]
        }

        const { count, rows: slides} = await ImageSlide.findAndCountAll({
            where: whereClause,
            limit: size,
            offset,
            order: [[ 'createdAt', 'DESC']]
        });

        const totalPages = Math.ceil(count/size);
        return {
            slides,
            totalPages,
            currentPage: page,
            totalSlides: count,
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy danh sách thất bại " + error.message)
    }
}

const deleteImageSlide = async(id) => {
    try {
        // 1. Tìm ảnh trong DB
        const slide = await getImageSlidesById(id);

        // 2. Xóa file vật lý
        const filePath = path.join(process.cwd(), slide.url.slice(1));
        
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error deleting file:', err);
            }
        });

        //3. Xóa record trong DB
        await slide.destroy()
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xóa ảnh thất bại ' + error.message)
    }
}

const createImageServices = async(serviceBody, file) => {
    try {
        if(file){
            const fileSize = file.size;
            const maxSize = 10 * 1024 * 1024;
            if(fileSize > maxSize){
                throw new ApiError(StatusCodes.BAD_REQUEST, "Image size exceed 10MB limit")
            }
            const urlService = await uploadService.uploadImageServices(file);
            serviceBody.image_url = urlService;
            const service = await Service.create(serviceBody);
            return service;
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Thêm dịch vụ thất bại " + error.message);
    }
}

const updateService = async(id, serviceBody, file) => {
    try {
        const service = await getServiceById(id)
        if(file){
            const fileSize = file.size;
            const maxSize = 10 * 1024 * 1024;
            if(fileSize > maxSize){
                throw new ApiError(StatusCodes.BAD_REQUEST, "Image size exceed 10MB limit")
            }
            const urlService = await uploadService.uploadImageServices(file);
            serviceBody.image_url = urlService;
            await service.update(serviceBody);
        }else{
            await service.update(serviceBody);
        }
        return service
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Cập nhật dịch vụ thất bại " + error.message);
    }
}

const getServices = async(queryOptions) => {
    try {
        const { page, size, searchTerm} = queryOptions;
        const offset = page * size;
        const whereClause = {};
        if(searchTerm){
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${searchTerm}%`}},
                { content: { [Op.iLike]: `%${searchTerm}%`}},
            ]
        }
        const { count, rows: services} = await Service.findAndCountAll({
            where: whereClause,
            limit: size,
            offset,
            order: [[ 'id', 'ASC']]
        });
        const totalPages = Math.ceil(count/size);
        return {
            services,
            totalPages,
            currentPage: page,
            totalServices: count,
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy danh sách thất bại " + error.message)
    }
}
const deleteService = async(id) => {
    try {
        // 1. Tìm dịch vụ trong DB
        const service = await getServiceById(id);

        // 2. Xóa file vật lý
        const filePath = path.join(process.cwd(), service.image_url.slice(1));
        
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error deleting file:', err);
            }
        });

        //3. Xóa record trong DB
        await service.destroy()
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Xóa dịch vụ thất bại ' + error.message)
    }
}

module.exports = {
    uploadImageSlide,
    getImageSlides,
    getImageSlidesById,
    deleteImageSlide,
    createImageServices,
    getServiceById,
    getServices,
    deleteService,
    updateService
}