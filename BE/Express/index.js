const express = require('express')
require('dotenv').config();
const app = express()
const PORT =  process.env.PORT || 5000
// chuyen tat cac yeu cau bat dau /user sang userRouter
const userRouter = require("./routers/User")
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users',userRouter)

app.listen(PORT, () =>{ console.log(`listening on ${PORT}`)})