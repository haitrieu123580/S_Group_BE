const express = require("express")
const userRouter = express.Router();
const connection = require('../database/connection')

// get all users
userRouter.get('/', (req, res) => {
    connection.query('select * from Users', (err, result) => {
        const mappedResult = result.map((row) => {
            return {
                ...row,
                gender: row.gender === 1 ? true : false,
            };
        });
        res.json(mappedResult);
    })

})
// get user by id
userRouter.get('/:id', (req, res) => {
    connection.query('select * from Users where id = ?', [parseInt(req.params.id)], (err, result) => {
        if (err) throw err
        const mappedResult = result.map((row) => {
            return {
                ...row,
                gender: row.gender === 1 ? true : false,
            };
        });
        res.json(mappedResult).status(200);
    })

})
// validate
function Validate(req, res, next) {
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    if (parseInt(req.body.age) <= 0) {
        res.status(400).json({ message: 'age not valid' })
    }
    else if (!nameRegex.test(req.body.fullname)) {
        res.status(400).json({ message: 'fullname not valid' })
    }
    else {
        next()
    }
}

// create new user
userRouter.post('/', Validate, (req, res) => {
    let fullname = req.body.fullname
    let age = parseInt(req.body.age)
    let gender = (req.body.gender === "true")
    connection.query('insert into Users (fullname, age, gender) values (?,?,?)', [fullname, age, gender], (err, result) => {
        if (err) throw err
        res.status(201).json({ message: 'add successed' })
    })
})
// update user by id
userRouter.put('/:id', (req, res) => {
    id = parseInt(req.params.id)
    let fullname = req.body.fullname
    let age = parseInt(req.body.age)
    let gender = (req.body.gender === "true")

    connection.query(`update Users set fullname = ?, age = ?, gender = ? where id = ?`, [fullname, age, gender, id], (err, result) => {
        if (err) {
            res.json({ message: 'not found' })
            throw err
        }
        res.status(204).json(result)
    })
})
// delete user
userRouter.delete('/:id', (req, res) => {
    id = parseInt(req.params.id)
    connection.query('delete from Users where id = ?', [id], (err, result) => {
        if (err) {
            res.json({ message: 'not found' })
            throw err
        }
        res.status(204).json(result)
    })
})
module.exports = userRouter