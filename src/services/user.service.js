const { User, Op } = require('../models');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const isUsernameTaken = async (username) => {
  const user = await User.findOne({ where: { username } });
  return !!user;
};

const createUser = async (userBody) => {
  if (await isUsernameTaken(userBody.username)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Tên đăng nhập đã được sử dụng.');
  }
  const hashedPassword = await bcrypt.hash(userBody.password, 10);
  const user = await User.create({ ...userBody, password: hashedPassword });
  user.password = undefined; // Không trả về password
  return user;
};

const getAllUsers = async (filter) => {
    // filter có thể là { role: 'employee' }
    const users = await User.findAll({
        where: filter,
        attributes: { exclude: ['password'] }
    });
    return users;
}

const getUserById = async (id) => {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng');
    }
    return user;
}

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (updateBody.password) {
        updateBody.password = await bcrypt.hash(updateBody.password, 10);
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
}


const deleteUserById = async (userId, currentAdminId) => {
  if (userId == currentAdminId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Bạn không thể tự xóa tài khoản của mình.');
  }
  const user = await getUserById(userId);
  await user.destroy();
  return user;
};

const queryUsers = async (queryOptions, currentUserId) => {
  const { page, limit, role } = queryOptions;
  const offset = (page - 1) * limit;

  const whereConditions = {
    id: { [Op.ne]: currentUserId }, 
  };

  if (role) {
    whereConditions.role = role;
  }
  
  const { count, rows: users } = await User.findAndCountAll({
    where: whereConditions,
    limit,
    offset,
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
  
  const totalPages = Math.ceil(count / limit);

  return {
    users,
    totalPages,
    currentPage: page,
    totalUsers: count,
  };
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  queryUsers,
};