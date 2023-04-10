const express = require('express')
const app = express()
const PORT = 3000
// chuyen tat cac yeu cau bat dau /user sang userRouter
const userRouter = require("./routers/User")
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users',userRouter)



app.listen(PORT, () =>{ console.log(`listening on ${PORT}`)})