const { body } = require("express-validator");
const Joi = require("joi");

const createRoleGroup = {
    body: Joi.object({
        name: Joi.string().required(),
        permission: Joi.array().optional(),
    })
}

const assignRoleGroupToUser = {
    body: Joi.object({
        userId: Joi.number().required(),
        roleGroupId: Joi.number().required(),
    })
}

const getRoleGroupToUser = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
    createRoleGroup,
    assignRoleGroupToUser,
    getRoleGroupToUser
}