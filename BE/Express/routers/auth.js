require('dotenv').config()
const express = require('express')
const authRouter = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const { hashedPassword } = require('../hash/hash')
// const JWT_SECRET = process.env.JWT_SECRET
const crypto = require('crypto')

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
})
const db = require('../database/connection')
const { executeQuery, getOne, create } = require('../database/query')

authRouter.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Find user in db
    const user = await getOne({
        db: db,
        query: `select * from users where username = ?`,
        params: username
    })
    console.log(user)
    // Case 1: User does not exist
    if (!user) {
        return res.status(400).json({
            message: 'User not found',
        });
    }

    // Case 2: Found user with that username

    const comparePassword = ({ input, encryptedPassword, salt }) => {
        const hashedRawPassword = crypto.pbkdf2Sync(input, salt, 1000, 64, 'sha512').toString('hex');
        return encryptedPassword === hashedRawPassword;
    };

    const isPasswordMatch = comparePassword({
        input: password,
        encryptedPassword: user.password,
        salt: user.salt,
    });
    if (isPasswordMatch) {
        console.log('Okay');
        const jwt = jsonwebtoken.sign({
            username: user.username,
            email: user.email,
            age: user.age,
        }, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d',
        });
        // Return jwt to user
        return res.status(200).json({
            // data: jwt,
            message: 'Login success',
        });
    } else {
        return res.status(401).json({
            message: 'Invalid credentials',
        });
    }
});

authRouter.get('/authorization', (req, res) => {
    const username = req.query.username
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    // Bearer <token>>
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
        // Verify the token is valid
        const isTokenValid = jsonwebtoken.verify(token, publicKey);
        if (isTokenValid.username == username) {
            const user = users.find(u => u.username === username)
            return res.status(200).json({
                email: user.email
            })
        }
        return res.status(401).json({ error: "Not Authorized" });
    } catch (error) {
        return res.status(401).json({ error: "Not Authorized" });
    }

})

// REGISTER

const validation = (req, res, next) => {
    user = {
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        email: req.body.email,
        gender: req.body.gender,
        name: req.body.name,
        age: parseInt(req.body.age),
    }
    if (user.age <= 0) {
        return res.status(400).json({ message: 'age not valid' })
    }
    else if (user.username.length <= 2 || user.password.length <= 2) {
        return res.status(400).json({ message: 'username or password not valid' })
    }
    else if (user.password !== user.confirmPassword) {
        return res.status(400).json({ message: '2 password not same' })
    }
    else {
        next()
    }

}
authRouter.post('/register', validation, async (req, res) => {
    const { salt, ecyptedPassword } = await hashedPassword(req.body.password)
    user = {
        username: req.body.username,
        password: ecyptedPassword,
        email: req.body.email,
        gender: req.body.gender,
        name: req.body.name,
        age: parseInt(req.body.age),
        salt: salt,
    }

    await create({
        db: db,
        query: `insert into Users (username, password,email, gender,name, age, salt) values (?,?,?,?,?,?,?)`,
        params: [user.username, user.password, user.email, user.gender, user.name, user.age, user.salt],
    })
    res.status(201).json({ message: 'create new user' })
})
module.exports = authRouter