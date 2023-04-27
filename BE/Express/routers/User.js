const express = require("express")
const userRouter = express.Router();
const connection = require('../database/connection')
const { verifyToken } = require('./verifyToken')
const { executeQuery, getOne, create } = require('../database/query')
// get all users
userRouter.get('/', (req, res) => {
    connection.query('select * from Users', (err, result) => {
        const mappedResult = result.map((row) => {
            return {
                ...row,
                gender: row.gender === 1 ? true : false,
            };
        });
        return res.json(mappedResult);
    })

})
// get user by id
userRouter.get('/:id', verifyToken, async (req, res) => {
    if (req.user.id === parseInt(req.params.id)) {
        const user = await getOne({
            db: connection,
            query: `select * from Users where id = ?`,
            params: [req.user.id]
        })
        return res.status(200).json({ message: user })
    }
    else {
        return res.status(400).json({ message: "not allowed" })
    }
})

// update user by id
userRouter.put('/:id', verifyToken, async (req, res) => {
    if (req.user.id === parseInt(req.params.id)) {
        //same user
        await executeQuery({
            db: connection,
            query: `update Users set name = ?, age = ?, gender = ? where id = ?`,
            params: [req.body.name, req.body.age, req.body.gender, req.params.id]
        })
        return res.status(200).json({ message: 'update successed' })
    }
    else {
        return res.json({ message: "not allowed" })
    }
})
// delete user
userRouter.delete('/:id', verifyToken, async (req, res) => {
    if (req.user.id === parseInt(req.params.id)) {
        await executeQuery({
            db: connection,
            query: `delete from Users where id = ?`,
            params: [req.params.id]
        })
        return res.status(200).json({ message: 'delete successed' })
    }
    else {
        return res.json({ message: "not allowed" })
    }
})
module.exports = userRouter