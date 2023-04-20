const express = require('express')
const authRouter = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET


const users = [    {
    username: 'your-username',
    age: 22,
    email: 'a@gmail.com',
    id: 1,
    password: 'your-password',
},
{
    username: 'your-username2',
    age: 24,
    email: 'b@gmail.com',
    id: 2,
    password: 'your-username2',
}]

authRouter.post('/login',(req, res, next)=> {
    const username = req.body.username;
    const password = req.body.password;

    // Find user in db
    const user = users.find(u => u.username === username);

    // Case 1: User does not exist
    if (!user) {
        return res.status(400).json({
            message: 'User not found',
        });
    }

    // Case 2: Found user with that username
    if (user.password === password) {
        // Sign a jwt
        const jwt = jsonwebtoken.sign({
            username: user.username,
            email: user.email,
            age: user.age,
        }, JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1d',
        });

        // Return jwt to user
        return res.status(200).json({
            data: jwt,
            message: 'Login success',
        });
    }

    return res.status(401).json({
        message: 'Invalid credentials',
    });
});

authRouter.get('/authorization', (req, res) => {
    const username = req.query.username
    console.log(username)
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    // Bearer <token>>
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token is valid
        const isTokenValid = jsonwebtoken.verify(token, JWT_SECRET);
        if(isTokenValid.username==username){
            const user = users.find(u=> u.username === username)
            return res.status(200).json({
                email:user.email
            })
        }
        return res.status(401).json({ error: "Not Authorized" });
    } catch (error) {
        return res.status(401).json({ error: "Not Authorized" });
    }

})

module.exports = authRouter