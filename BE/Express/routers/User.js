const express = require("express")
const userRouter = express.Router();
const db = require('../database/connection')
const { verifyToken } = require('./verifyToken')
const { executeQuery, getOne, create, updateOne } = require('../database/query')

//get user by id
userRouter.get('/:id', verifyToken, async (req, res) => {
    if (req.user.id === parseInt(req.params.id)) {
        const user = await getOne({
            db: db,
            query: db.select().from('users').where('id','=',req.user.id).first().toQuery()
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
        await updateOne({
            db: db,
            query: db('users')
                    .where('id', req.params.id)
                    .update({
                        'name':req.body.name,
                        'age':req.body.age,
                        'gender':req.body.gender
                    })
                    .toQuery()
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
            db: db,
            query: db('users')
                    .where('id',req.params.id)
                    .del()
                    .toQuery()
        })
        return res.status(200).json({ message: 'delete successed' })
    }
    else {
        return res.json({ message: "not allowed" })
    }
})
module.exports = userRouter