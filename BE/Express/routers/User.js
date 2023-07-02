const express = require("express")
const userRouter = express.Router();
const knex = require('../database/connection')
const { verifyToken, verifyTokenAndAuthorization } = require('../middleware/verifyToken')
const { hashedPassword, comparePassword } = require('../hash/hash');
const { validateRegisterRequest } = require("../middleware/validation");
const { canAccessBy } = require("../middleware/verifyRoles");
const Permission = require('../utils/allowPermission');
// create new user by admin
userRouter.post('/create-user', [verifyToken, validateRegisterRequest,
    canAccessBy(Permission.CreateUser)], async (req, res) => {
        const existedUsername = await knex.select().from('users').where('username', req.body.username).first()
        if (!existedUsername) {
            const { salt, ecryptedPassword } = await hashedPassword(req.body.password)
            user = {
                username: req.body.username,
                password: ecryptedPassword,
                email: req.body.email,
                gender: req.body.gender,
                name: req.body.name,
                age: parseInt(req.body.age),
                salt: salt,
                createdBy: req.user.id,
            }
            await knex.insert(user).into('users')
            return res.status(201).json({ message: 'created new user' })
        }
        return res.status(200).json({ message: 'username already existed' })

    })
userRouter.get('/getusers', async (req, res) => {
    let page_size = req.query.page_size || 10; // Kích thước trang mặc định là 10 nếu không được cung cấp
    let page_index = req.query.page_index || 1; // Trang hiện tại mặc định là 1 nếu không được cung cấp
    let age = req.query.age || null; // Giá trị tuổi tìm kiếm, mặc định là null nếu không được cung cấp

    let query = knex.select("id", "name", "age").from("users");

    // Tìm kiếm theo tuổi nếu giá trị tuổi được cung cấp
    if (age) {
        query = query.where("age", age);
    }

    // Đếm tổng số bản ghi
    let countQuery = knex.count("* as count").from("users").first();
    let countResult = await countQuery;

    let count = countResult.count;
    let offset = (page_index - 1) * page_size;

    // Lấy dữ liệu người dùng với phân trang và tìm kiếm theo tuổi
    let dataQuery = query.offset(offset).limit(page_size);
    let dataResult = await dataQuery;

    let rows = dataResult;
    let pagination = {};
    pagination.total = count;
    pagination.per_page = page_size;
    pagination.offset = offset;
    pagination.to = offset + rows.length;
    pagination.last_page = Math.ceil(count / page_size);
    pagination.current_page = page_index;
    pagination.from = offset;
    pagination.data = rows;
    res.status(200).json({ message: pagination });
});

//get user by id
userRouter.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const user = await knex.select().from('users').where('id', '=', req.user.id).first()
    return res.status(200).json({ message: user })
})

// update user by id
userRouter.put('/:id', [verifyTokenAndAuthorization, canAccessBy(Permission.UpdateUser)], async (req, res) => {
    await knex('users')
        .where('id', req.params.id)
        .first()
        .update({
            'name': req.body.name,
            'age': req.body.age,
            'gender': req.body.gender,
        })
    return res.status(200).json({ message: 'update successed' })
})
// delete user
userRouter.delete('/:id', [verifyTokenAndAuthorization, canAccessBy(Permission.DeleteUser)], async (req, res) => {
    await knex('users')
        .where('id', req.params.id)
        .first()
        .del()
    return res.status(200).json({ message: 'delete successed' })
})
// ASSIGN ROLE TO USER
userRouter.post('/assign-role/:userId',canAccessBy(Permission.SetRole), async (req, res) => {
    try {
        const userId = parseInt(req.params.userId)
        const { roles } = req.body;
        // find existed role
        const user = knex('users').select().where('id', userId).first()
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        const roleWithUserId = roles.map((x) => {
            // console.log(x);
            return { userId: userId, roleId: parseInt(x) }
        })
        await knex('users_roles')
            .insert(roleWithUserId)
        return res.status(201).json({ message: 'assigned roles' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something wrong when assigning new role',
        });
    }
})
module.exports = userRouter