// src/services/permission.service.js
const { Menu, Action, Op, RoleGroup, RoleGroupMenu, RoleGroupAction, UserRole, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const userService = require('./user.service');

const getRoleGroupById = async (id) => {
    const roleGroup = await RoleGroup.findByPk(id);
    if (!roleGroup) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy nhóm quyền');
    }
    return roleGroup;
}

const getMenuWithAction = async() => {
    try {
        const menus = await Menu.findAll({
            include: [
                {
                    model: Action,
                    as: 'actions',
                    attributes: [ 'id', 'code', 'name', 'path']
                }
            ],
            order: [
                [ 'id', 'ASC'],
                [ 'actions', 'id', 'ASC']
            ]
        });
        const modules = menus.map(menu => ({
            id: menu.id,
            code: menu.code,
            name: menu.name,
            path: menu.path,
            actions: (menu.actions || []).map(action => {
                const result = {
                    id: action.id,
                    code: action.code,
                    name: action.name
                };
                if(action.path) {
                    result.path = action.path
                }
                return result;
            })
        }));
        return modules;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy danh sách thất bại: " + error.message)
    }
}

const createRoleGroup = async({ name, permission}) => {
    try {
        const roleGroup = await RoleGroup.create({ name });

        const menuMap = {}
        const actionIds = [];

        for (const item of permission) {
            const menu = await Menu.findOne({ where: { code: item.code}});
            if(!menu){
                throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại chức năng này");
            };

            menuMap[item.code] = menu.id;
            await RoleGroupMenu.create({ role_group_id: roleGroup.id, menu_id: menu.id});

            for(const action of item.actions){
                const actionModel = await Action.findOne({ where: { code: action.code} });
                if(actionModel){
                    actionIds.push(actionModel.id);
                    await RoleGroupAction.create({ role_group_id: roleGroup.id, action_id: actionModel.id})
                }
            }
        }
        return roleGroup;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lưu nhóm quyền thất bại: " + error.message)
    }
}

const getAllRoleGroups = async () => {
    try {
        const roleGroups = await RoleGroup.findAll({
            include: [
                {
                    model:  RoleGroupMenu,
                    as: 'roleGroupMenu',
                    include: [
                        { model: Menu, as: 'menu'}
                    ]
                },
                {
                    model: RoleGroupAction,
                    as: 'roleGroupAction',
                    include: [
                        { model: Action, as: 'action'}
                    ]
                }
            ]
        });

        return roleGroups.map(rg => ({
            id: rg.id,
            name: rg.name,
            permission: rg.roleGroupMenu.map((rgm) => {
                const menu = rgm.menu;
                return{
                    id: menu.id,
                    code: menu.code,
                    name: menu.name,
                    path: menu.path,
                    actions: (rg.roleGroupAction ?? [])
                        .filter((rga) => rga.action.menu_id === menu.id)
                        .map((rga) => {
                            const action = rga.action;
                            return{
                                id: action.id,
                                code: action.code,
                                name: action.name,
                                path: action.path
                            }
                        })
                }
            })
        }))
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy danh sách nhóm quyền thất bại: " + error.message)
    }
}

const getRoleGroupByUserId = async (userId) => {
    try {
        const roleGroup = await RoleGroup.findOne({
            include: [
                {
                    model: UserRole,
                    as: 'roleUser',
                    where: {
                        user_id: userId
                    }
                },
                {
                    model:  RoleGroupMenu,
                    as: 'roleGroupMenu',
                    include: [
                        { model: Menu, as: 'menu'}
                    ]
                },
                {
                    model: RoleGroupAction,
                    as: 'roleGroupAction',
                    include: [
                        { model: Action, as: 'action'}
                    ]
                }
            ],
            order: [
                ['roleGroupMenu', 'id', 'ASC']
            ]
        });

        return {
            id: roleGroup.id,
            name: roleGroup.name,
            permission: roleGroup.roleGroupMenu.map((rgm) => {
                const menu = rgm.menu;
                return{
                    id: menu.id,
                    code: menu.code,
                    name: menu.name,
                    path: menu.path,
                    icon: menu.icon,
                    actions: (roleGroup.roleGroupAction ?? [])
                        .filter((rga) => rga.action.menu_id === menu.id)
                        .map((rga) => {
                            const action = rga.action;
                            return{
                                id: action.id,
                                code: action.code,
                                name: action.name,
                                path: action.path
                            }
                        })
                }
            })
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Lấy danh sách nhóm quyền thất bại: " + error.message)
    }
}

const assignRoleGroupToUser = async(userId, roleGroupId) => {
    const user = await userService.getUserById(userId);
    const roleGroup = await getRoleGroupById(roleGroupId);
    try {
        const existingUserRole = await UserRole.findOne({ where: { user_id: userId}});
        if(existingUserRole) {
            //Nếu đã nhóm quyền thì cập nhật
            existingUserRole.role_group_id = roleGroupId;
            await existingUserRole.save();
        }else {
            //Nếu chưa có thì tạo mới
            await UserRole.create({ user_id: userId, role_group_id: roleGroupId})
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Gán ${roleGroup.name} cho ${user.fullName} ` + error.message)
    }
}

module.exports = {
    getMenuWithAction,
    createRoleGroup,
    getAllRoleGroups,
    assignRoleGroupToUser,
    getRoleGroupByUserId
}