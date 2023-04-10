const express = require("express")
const userRouter = express.Router();
let users = require('../User')

let id = users.length

// get all users
userRouter.get('/', (req, res) => {
    res.json(users)
})
// get user by id
userRouter.get('/:id', (req, res) => {
    const found = users.find(user => user.id == parseInt(req.params.id))
    res.json(found).status(200)
})
// validate
function Validate(req, res, next) {
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    if(parseInt(req.body.age) <= 0){
        res.status(400).json({message:'age not valid'})
    }
    else if(!nameRegex.test(req.body.fullname)){
        res.status(400).json({message:'fullname not valid'})
    }
    else{
        next()
    }
}   

// create new user
userRouter.post('/', Validate, (req, res) => {
    const newUser = {
        "id": id + 1,
        ...req.body,
    }
    id = id + 1
    users.push(newUser)
    res.status(201).json(newUser)
})
// update user by id
userRouter.put('/:id', (req, res) => {

    const index = users.findIndex(user => user.id === parseInt(req.params.id));
    if (index !== -1) {
        const updated = { ...users[index], ...req.body }; // tạo user mới đã được cập nhật thông tin
        users.splice(index, 1, updated); // cập nhật thông tin của user trong mảng
        res.status(204).json({ msg: 'user updated', updated });
    }
    else {
        res.json({'message':'not found'})
    }

})
// delete user
userRouter.delete('/:id', (req, res) => {
    users = users.filter(user => user.id !== parseInt(req.params.id));
    res.status(204).res.json({'message':''})
})
module.exports = userRouter