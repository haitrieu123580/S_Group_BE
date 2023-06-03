const express = require("express")
const userRouter = express.Router();
const knex = require('../database/connection')
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken')
const { executeQuery, getOne, create, updateOne } = require('../database/query')
const { hashedPassword, comparePassword } = require('../hash/hash');
const { validateRegisterRequest } = require("../middleware/validation");

// create new user by admin
userRouter.post('/createUser', [verifyToken, validateRegisterRequest], async (req, res) => {
    if (req.user.isAdmin) {
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
    }
    else {
        return res.json({ message: 'not allowed' })
    }
})
// pagination
userRouter.get('/getusers', async (req, res) => {
    let page_size = req.query.page_size, page_index = req.query.page_index
    var pagination = {};
    if (page_index < 1) page_index = 1;
    var offset = (page_index - 1) * page_size;
    return Promise.all([
        knex.count('* as count').from("users").first(),
        knex.select("*").from("users").offset(offset).limit(page_size)
    ]).then(([total, rows]) => {
        var count = total.count;
        var rows = rows;
        pagination.total = count;
        pagination.per_page = page_size;
        pagination.offset = offset;
        pagination.to = offset + rows.length;
        pagination.last_page = Math.ceil(count / page_size);
        pagination.current_page = page_index;
        pagination.from = offset;
        pagination.data = rows;
        res.status(200).json({ message: pagination })
    });
})
//get user by id
userRouter.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const user = await knex.select().from('users').where('id', '=', req.user.id).first()
        return res.status(200).json({ message: user })
})

// update user by id
userRouter.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    await knex('users')
        .where('id', req.params.id)
        .update({
            'name': req.body.name,
            'age': req.body.age,
            'gender': req.body.gender,
        })
    return res.status(200).json({ message: 'update successed' })
})
// delete user
userRouter.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    await knex('users')
        .where('id', req.params.id)
        .del()
    return res.status(200).json({ message: 'delete successed' })
})

module.exports = userRouter