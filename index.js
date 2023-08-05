const express = require('express')
require('dotenv').config();
const cors = require('cors')
const app = express()
app.use(cors());
const PORT =  process.env.PORT || 5000
// chuyen tat cac yeu cau bat dau /user sang userRouter
const userRouter = require("./routers/User")
const authRouter = require("./routers/auth")
const pollRouter = require('./routers/poll')
const roleRouter = require('./routers/roles')
const permissionRouter = require('./routers/permission')
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth',authRouter)
app.use('/users',userRouter)
app.use('/poll', pollRouter)
app.use('/role',roleRouter)
app.use('/permission',permissionRouter)
app.listen(PORT, () =>{ console.log(`listening on ${PORT}`)})