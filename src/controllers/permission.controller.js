const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const permissionService  = require('../services/permission.service');

const getAllModules = catchAsync(async (req, res) => {
  const modules = await permissionService.getMenuWithAction()
  res.status(StatusCodes.OK).send({ success: true, message: "Lấy danh sách thành công" ,data: modules });
});

const createRoleGroup = catchAsync(async (req, res) => {
  const roleGroup = await permissionService.createRoleGroup(req.body);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Lưu nhóm quyền thành công', data: roleGroup});
})

const getAllRoleGroups = catchAsync(async (req, res) => {
  const data = await permissionService.getAllRoleGroups();
  res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách nhóm quyền thành công', data: data})
})

const assignRoleGroupToUser = catchAsync(async (req, res) => {
  const { userId, roleGroupId } = req.body;
  await permissionService.assignRoleGroupToUser(userId, roleGroupId);
  res.status(StatusCodes.OK).send({ success: true, message: 'Gán nhóm quyền thành công'})
})

const getRoleGroupByUserId = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.id);
  const data = await permissionService.getRoleGroupByUserId(userId);
  res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách nhóm quyền được gán thành công', data: data})
})

module.exports = {
    getAllModules,
    createRoleGroup,
    getAllRoleGroups,
    assignRoleGroupToUser,
    getRoleGroupByUserId
}