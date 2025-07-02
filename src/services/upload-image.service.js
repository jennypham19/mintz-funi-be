const path = require('path');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs/promises');

const PATH_DIR = path.join(__dirname, '..','..', 'uploads');

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

const uploadImageBlog = async(file) => {
    if(!file) throw ApiError(StatusCodes.NOT_FOUND, "Image blog is empty");
    const contentType = file.mimetype;
    if(!['image/png', 'image/jpeg', 'image/jpg'].includes(contentType)){
        throw new ApiError(StatusCodes.ACCEPTED, "Only PNG, JPG or JPEG images accepted")
    }

    const fileName = `image_blog_${Math.floor(Math.random() * 6)}_${file.originalname}`;
    const savePath = path.join(PATH_DIR, fileName);
    await fs.mkdir(PATH_DIR, { recursive: true});
    await fs.writeFile(savePath, file.buffer);
    return `/uploads/${fileName}`;
}

module.exports = {
    uploadAvatar,
    uploadImageBlog
}