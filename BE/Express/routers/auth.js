require('dotenv').config()
const express = require('express')
const authRouter = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const { hashedPassword, comparePassword } = require('../hash/hash')
const JWT_SECRET = process.env.JWT_SECRET
const crypto = require('crypto')
const { mailService } = require('../services/mail.service')
const db = require('../database/connection')
const { executeQuery, getOne, create, updateOne } = require('../database/query')
const { validateRegisterRequest } = require('../middleware/validation')
const { emit } = require('process')
authRouter.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Find user in db
    const user = await getOne({
        db: db,
        query: db.select().from('users').where('username', username).toQuery(),
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


//REGISTER
authRouter.post('/register', validateRegisterRequest, async (req, res) => {
    // find username existed 
    const existedUsername = await getOne({
        db: db,
        query: db.select().from('users').where('username', req.body.username).toQuery(),
    })
    if (!existedUsername) {
        const { salt, ecryptedPassword } = await hashedPassword(req.body.password)
        user = {
            username: req.body.username,
            password: ecryptedPassword,
            email: req.body.email,
            gender: req.body.gender,
            name: req.body.name,
            age: parseInt(req.body.age),
            salt: salt,
        }
        await create({
            db: db,
            query: db.insert(user).into('users').toQuery(),
        })
        return res.status(201).json({ message: 'created new user' })
    }
    return res.status(200).json({ message: 'username already existed' })
})

// RESET-PASSWORD
authRouter.post('/forgot-password', async (req, res) => {
    email = req.body.email
    // check exist email
    const isExist = await getOne({
        db: db,
        query: db.select().from('users').where('email', email).toQuery()
    })
    if (isExist) {
        const secretKey = crypto.randomBytes(16).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(secretKey).digest('hex');

        const passwordResetAt = new Date(Date.now() + 10 * 60 * 1000);
        const updateStatus = await updateOne({
            db,
            query: db('users')
                .where('email', '=', email)
                .update({
                    'passwordResetToken': passwordResetToken,
                    'passwordResetAt': passwordResetAt,
                })
                .toQuery()
        });
        if (updateStatus) {
            await mailService.sendEmail({
                emailFrom: 'admin@gmail.com',
                emailTo: email,
                emailSubject: 'Reset password',
                emailText: `Reset token: ${passwordResetToken}`,
            })
            // save passwordResetToken and passwordResetExpiration to DB
            res.status(200).json({ message: 'Check your email, plz' })
        }
        else {
            res.status(400).json({ message: `can't reset password` })
        }

    }
    else {
        res.json({ message: 'email not exist' })
    }
})

authRouter.post('/reset-password', async function (req, res) {

    try {
        const { email, passwordResetToken, newPassword } = req.body;
        const isExist = await getOne({
            db: db,
            query: db('users')
                .select()
                .from('users')
                .where({
                    'email': email,
                    'passwordResetToken': passwordResetToken
                })
                .andWhere('passwordResetAt', '>', new Date())
                .toQuery()
        })
        if (isExist) {
            const { salt, ecryptedPassword } = await hashedPassword(newPassword)

            const updateUser = await updateOne({
                db: db,
                query: db('users')
                    .where('email', email)
                    .update({
                        'password': ecryptedPassword,
                        'salt': salt,
                        'passwordResetToken': null,
                        'passwordResetAt': null
                    })
                    .toQuery()
            })
            if (updateUser) {
                return res.status(200).json({
                    message: 'reset password successfully',
                });
            }
            else {
                return res.status(400).json({
                    message: 'reset password failed',
                });
            }

        }
        else {
            return res.status(403).json({
                message: 'invalid token or token has expired',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'error'
        });
    }
});

module.exports = authRouter