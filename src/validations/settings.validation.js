const Joi = require('joi');

const getSlides = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(0).default(0),
        size: Joi.number().integer().min(1).max(100).default(12), 
        searchTerm: Joi.string().optional(),
    })
}

const uploadSlide = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        url: Joi.string().optional(),
        createdAt: Joi.string().optional(),
        updatedAt: Joi.string().optional(),
    })
}

const getSlide = {
    params: Joi.object().keys({
        id: Joi.number().integer().required(),
    }),
}

const bodyService = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        image_url: Joi.string().optional(),
        content: Joi.string().required(),
        createdAt: Joi.string().optional(),
        updatedAt: Joi.string().optional(),
    })
}

const updateService = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
        title: Joi.string().required(),
        image_url: Joi.string().optional(),
        content: Joi.string().required(),
        createdAt: Joi.string().optional(),
        updatedAt: Joi.string().optional(),
    })
    .min(1), // Yêu cầu có ít nhất 1 trường để cập nhật
};

const getServices = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(0).default(0),
        size: Joi.number().integer().min(1).max(100).default(12), 
        searchTerm: Joi.string().optional(),
    })
}

const getService = {
    params: Joi.object().keys({
        id: Joi.number().integer().required()
    })
}

module.exports = {
    getSlides,
    uploadSlide,
    getSlide,
    bodyService,
    getService,
    getServices,
    updateService
}