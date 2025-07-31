const path = require('path');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs/promises');

const PATH_DIR = path.join(__dirname, '..','..', 'uploads');
const PATH_DIR_SLIDE = path.join(__dirname, '..','..', 'uploads', 'slide');
const PATH_DIR_SERVICES = path.join(__dirname, '..','..', 'uploads', 'services');
const PATH_DIR_DESIGN_BUILD = path.join(__dirname, '..','..', 'uploads', 'design-builds');



const uploadAvatar = async(file) => {
    if(!file) throw ApiError(StatusCodes.NOT_FOUND, "Avatar is empty");
    const contentType = file.mimetype;
    if(!['image/png', 'image/jpeg', 'image/jpg'].includes(contentType)){
        throw new ApiError(StatusCodes.ACCEPTED, "Only PNG, JPG or JPEG images accepted")
    }

    const fileName = `avatar_${Math.floor(Math.random() * 6)}_${file.originalname}`;
    const savePath = path.join(PATH_DIR, fileName);
    await fs.mkdir(PATH_DIR, { recursive: true});
    await fs.writeFile(savePath, file.buffer);
    return `/uploads/${fileName}`;
}

const uploadImageSlide = async(file) => {
    if(!file) throw ApiError(StatusCodes.NOT_FOUND, "Image slide is empty");
    const contentType = file.mimetype;
    if(!['image/png', 'image/jpeg', 'image/jpg'].includes(contentType)){
        throw new ApiError(StatusCodes.ACCEPTED, "Only PNG, JPG or JPEG images accepted")
    }

    const fileName = `image_slide_${Math.floor(Math.random() * 6)}.${file.originalname.split('.')[1]}`;
    const savePath = path.join(PATH_DIR_SLIDE, fileName);
    await fs.mkdir(PATH_DIR_SLIDE, { recursive: true});
    await fs.writeFile(savePath, file.buffer);
    return `/uploads/slide/${fileName}`;
}

const uploadImageServices = async(file) => {
    if(!file) throw ApiError(StatusCodes.NOT_FOUND, "Image services is empty");
    const contentType = file.mimetype;
    if(!['image/png', 'image/jpeg', 'image/jpg'].includes(contentType)){
        throw new ApiError(StatusCodes.ACCEPTED, "Only PNG, JPG or JPEG images accepted")
    }

    const fileName = `image_services_${Math.floor(Math.random() * 6)}.${file.originalname.split('.')[1]}`;
    const savePath = path.join(PATH_DIR_SERVICES, fileName);
    await fs.mkdir(PATH_DIR_SERVICES, { recursive: true});
    await fs.writeFile(savePath, file.buffer);
    return `/uploads/services/${fileName}`;
}

const uploadImageDesignAndBuild = async(file) => {
    if(!file) throw ApiError(StatusCodes.NOT_FOUND, "Image design and build is empty");
    const contentType = file.mimetype;
    if(!['image/png', 'image/jpeg', 'image/jpg'].includes(contentType)){
        throw new ApiError(StatusCodes.ACCEPTED, "Only PNG, JPG or JPEG images accepted")
    }

    const fileName = `image_design_build_${Math.floor(Math.random() * 6)}.${file.originalname.split('.')[1]}`;
    const savePath = path.join(PATH_DIR_DESIGN_BUILD, fileName);
    await fs.mkdir(PATH_DIR_DESIGN_BUILD, { recursive: true});
    await fs.writeFile(savePath, file.buffer);
    return `/uploads/design-builds/${fileName}`;
}

module.exports = {
    uploadAvatar,
    uploadImageSlide,
    uploadImageServices,
    uploadImageDesignAndBuild
}