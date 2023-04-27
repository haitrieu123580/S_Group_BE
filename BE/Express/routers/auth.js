require('dotenv').config()
const express = require('express')
const authRouter = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const { hashedPassword, comparePassword } = require('../hash/hash')
const JWT_SECRET = process.env.JWT_SECRET
const crypto = require('crypto')

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
    // Case 1: User does not exist
    if (!user) {
        return res.status(400).json({
            message: 'User not found',
        });
    }

    // Case 2: Found user with that username
    const isPasswordMatch = comparePassword({
        input: password,
        encryptedPassword: user.password,
        salt: user.salt,
    });
    if (isPasswordMatch) {
        console.log('Okay');
        data = {
            id: user.id,
            username: user.username,
            email: user.email,
            age: user.age,
        }
        const jwt = jsonwebtoken.sign(data, JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1d',
        });
        // Return jwt to user
        return res.status(200).json({
            accessToken: jwt,
            message: data,
        });
    } else {
        return res.status(401).json({
            message: 'Invalid credentials',
        });
    }
});

// VALIDATION
const validateRegisterRequest = (req, res, next) => {
    user = {
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        email: req.body.email,
        gender: req.body.gender,
        name: req.body.name,
        age: parseInt(req.body.age),
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    if (user.age <= 0) {
        res.status(400).json({ message: 'age not valid' })
    }
    else if (user.username.length <= 3 || user.password.length <= 3) {
        res.status(400).json({ message: 'username or password not valid' })
    }
    else if (user.password !== user.confirmPassword) {
        res.status(400).json({ message: '2 password not same' })
    }
    else if (!emailRegex.test(user.email)) {
        res.status(400).json({ message: 'email not valid' })
    }
    else if (user.name.length < 2) {
        res.status(400).json({ message: 'name not valid' })
    }
    else {
        next()
    }

}
//REGISTER
authRouter.post('/register', validateRegisterRequest, async (req, res) => {

    // find username existed 
    const existedUsername = await getOne({
        db: db,
        query: `select * from users where username = ?`,
        params: req.body.username
    })
    if (!existedUsername) {
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
        return res.status(201).json({ message: 'created new user' })
    }
    return res.status(200).json({ message: 'username already existed' })



})
module.exports = authRouter