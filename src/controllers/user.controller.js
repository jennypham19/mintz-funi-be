const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service.js');
const pick = require('../utils/pick');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo người dùng thành công', data: user });
});

const getUserDashboard = catchAsync(async (req, res) => {
  const queryOptions = pick(req.query, ['page', 'limit', 'role']);
  const currentUserId = req.user.id;

  const result = await userService.queryUsers(queryOptions, currentUserId);
  res.status(StatusCodes.OK).send({ success: true, data: result });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(StatusCodes.OK).send({ success: true, data: user });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.id, req.body);
  res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật thành công', data: user });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.id, req.user.id);
  res.status(StatusCodes.NO_CONTENT).send();
});


module.exports = {
  createUser,
  getUserDashboard,
  getUser,
  updateUser,
  deleteUser
};