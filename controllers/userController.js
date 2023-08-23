const { hashedPassword } = require('../hash/hash');
const User = require('../models/User.model');
const UserRole = require('../models/UserRole.model')
const multer = require('multer')
// // fake-data
// const fakeData = async(req, res) =>{
//   try {
//     for (i = 11; i<40; i++){
//       const { salt, encryptedPassword } = await hashedPassword('password'); 
//     await User.create({
//       username: `user${i}`,
//       password: encryptedPassword, 
//       email: `user${i}@email.com`,
//       gender: false,
//       name: `user${i}`,
//       age: 18,
//       salt: salt,
//     });

//     }
//     res.send('fake-data')

//   } catch (error) {

//   }
// }
//get all
const getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({ data: users })
  } catch (error) {

  }
}
// upload Avatar
const uploadAvatar = async (req, res) =>{
  try {
    
  } catch (error) {
    
  }
}
// create new user by admin
const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { salt, encryptedPassword } = await hashedPassword(req.body.password);
    const [user, created] = await User.findOrCreate({
      where: {
        username: req.body.username,
      },
      defaults: {
        username: req.body.username,
        password: encryptedPassword,
        email: req.body.email,
        gender: req.body.gender,
        name: req.body.name,
        age: parseInt(req.body.age),
        salt: salt,
        createdBy: req.user.id,
      },
    });
    if (created) {
      return res.status(200).json({ data:{
        id: user.id, 
        username: user.username, 
        email: user.email, 
        gender: user.gender, 
        age: user.age, 
        createdBy: user.createdBy,
        createdAt: user.createdAt
      } });
    } else {
      return res.status(400).json({ message: 'user existed' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Something wrong when creating new user',
    });
  }
};

const getUsers = async (req, res) => {
  let page_size = parseInt(req.query.page_size) || 10;
  let page_index = parseInt(req.query.page_index) || 1;
  let offset = (page_index - 1) * page_size;

  try {
    let count = await User.count();
    let users = await User.findAll({
      attributes: ['id', 'username', 'name', 'age', 'email', 'createdBy', 'createdAt', 'gender'],
      offset: offset,
      limit: page_size,
    });

    let pagination = {
      total: count,
      per_page: page_size,
      offset: offset,
      to: offset + users.length,
      last_page: Math.ceil(count / page_size),
      current_page: page_index,
      from: offset,
      users: users,
    };

    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(parseInt(req.params.id));
    if (user === null) {
      return res.json({ message: 'not found' })
    } else {
      return res.status(200).json({ message: user })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Something wrong',
    });
  }
}
// update user by id
const updateUser = async (req, res) => {
  try {
    const updatedFields = {
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender
    };

    const userId = parseInt(req.params.id);

    const [updatedRowsCount] = await User.update(updatedFields, {
      where: {
        id: userId
      }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Truy vấn lại thông tin người dùng sau khi cập nhật thành công
    const updatedUser = await User.findOne({
      where: {
        id: userId
      }
    });

    return res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error' });
  }
};



// delete user
const deleteUser = async (req, res) => {
  try {
    const result = await User.destroy({
      where: {
        id: parseInt(req.params.id)
      }
    });
    if (result) {
      return res.status(200).json({ message: 'deleted User' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error' })
  }
}
// ASSIGN ROLE TO USER
const assignRoleToUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const { roles } = req.body;
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }
    const roleWithUserId = roles.map((x) => {
      return { userId: userId, roleId: parseInt(x) }
    })
    await UserRole.bulkCreate(roleWithUserId);
    return res.status(201).json({ message: 'assigned roles' })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Something wrong when assigning new role',
    });
  }
}
module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRoleToUser,
  getAll
}