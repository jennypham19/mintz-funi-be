const { User, Token, RoleGroup, UserRole, RoleGroupMenu, RoleGroupAction, Menu, Action } = require('../models');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const tokenService = require('./token.service');
const userService = require('./user.service');


const loginWithUsernameAndPassword = async (username, password) => {
  try {
      const user = await User.findOne({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      if(user.is_deleted === 1) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên');
      }

      if (user.role === 'admin') {
        return user
      }else{
        const roleGroup = await RoleGroup.findOne({
          include: [
            {
              model: UserRole,
              as: 'roleUser',
              where: {
                user_id: user.id
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

        if (!roleGroup) {
          throw new ApiError(StatusCodes.FORBIDDEN, `Tài khoản ${user.username} chưa được gán quyền. Vui lòng liên hệ quản trị viên để được gán quyền`);
        }

        const roleGroupFormatted = {
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
        const userFormatted = {
          ...user.toJSON(),
          permission: roleGroupFormatted
        }
        return userFormatted;        
      }


  } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error during login process.' + error.message);
  }
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ where: { token: refreshToken, type: 'refresh' } });

  if (!refreshTokenDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Refresh token không tồn tại');
  }

  await refreshTokenDoc.destroy();
};

const changePassword = async (updateBody) => {
  const user = await userService.getUserById(updateBody.user_id);
  if (updateBody.password) {
    updateBody.password = await bcrypt.hash(updateBody.password, 10);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
}


module.exports = {
  loginWithUsernameAndPassword,
  changePassword,
  logout
};