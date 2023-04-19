const express = require('express')
const authRouter = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
authRouter.post('/login', (req, res) => {
    // database
    const user = {
        username: 'your-username',
        password: 'your-password'
    }
    const { username, password } = req.body
    if (username === user.username && password === user.password) {
        const data = {
            username: user.username
            // ...
        }
        return res.json({
            token: jsonwebtoken.sign(data, JWT_SECRET),
            message: 'login success'
        });
    }
    return res.json({ message: 'username or password not valid' })
})

authRouter.get('/authorization', (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    // Bearer <token>>
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token is valid
        const data = jsonwebtoken.verify(token, JWT_SECRET);
        return res.status(200).json({
            message: `Congrats ${data.username}! You can now accesss the profile`,
        });
    } catch (error) {
        return res.status(401).json({ error: "Not Authorized" });
    }

})

module.exports = authRouter