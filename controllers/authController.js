require('dotenv').config()
const { hashedPassword, comparePassword } = require("../hash/hash")
const { mailService } = require('../services/mail.service')
const { cacheService } = require('../services/cache.service')
const jsonwebtoken = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User.model')
const { Op } = require("sequelize");
const register = async (req, res) => {
    // find existed user
    const existedUsername = await User.findOne({ where: { username: req.body.username } })
    if (!existedUsername) {
        const { salt, encryptedPassword } = await hashedPassword(req.body.password)
        user = {
            username: req.body.username,
            password: encryptedPassword,
            email: req.body.email,
            gender: req.body.gender,
            name: req.body.name,
            age: parseInt(req.body.age),
            salt: salt,
        }
        try {
            await User.create(user)
            return res.status(201).json({ message: 'Created new user' })
        } catch (error) {
            console.log(error);
            res.json({ message: 'error when creating new user' })
        }
    }
    return res.status(200).json({ message: 'username already existed' })
}
const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.findOne({ where: { username: username } })
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
            await cacheService.setOneUser(user.id);
            data = {
                id: user.id,
                username: user.username,
                email: user.email,
                age: user.age,
                isAdmin: user.isAdmin,
            }
            const jwt = jsonwebtoken.sign(data, process.env.JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '1d',
            });
            // Return jwt to user
            return res.status(200).json({
                accessToken: jwt,
                message: data,
            });
        } else {
            return res.status(200).json({
                message: 'Invalid credentials',
            });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error' })
    }

}
const forgotPassword = async (req, res) => {
    email = req.body.email
    try {
        const isExist = await User.findOne({ where: { email: email } })
        if (isExist) {
            // create new passwordReset token and expired time
            const secretKey = crypto.randomBytes(16).toString('hex');
            const passwordResetToken = crypto.createHash('sha256').update(secretKey).digest('hex');
            const passwordResetAt = new Date(Date.now() + 10 * 60 * 1000);
            const updateStatus = await User.update({
                passwordResetToken: passwordResetToken,
                passwordResetAt: passwordResetAt
            },
                { where: { email: email } }
            );
            // send token to user email
            if (updateStatus) {
                await mailService.sendEmail({
                    emailFrom: 'admin@gmail.com',
                    emailTo: email,
                    emailSubject: 'Reset password',
                    emailText: `Reset token: ${passwordResetToken}`,
                })
                res.status(200).json({ message: 'Check your email, plz' })
            }
            else {
                res.status(400).json({ message: `email not valid` })
            }

        }
        else {
            res.json({ message: 'email not exist' })
        }
    } catch (error) {
        console.log(error);
        return res.json({ message: 'error' })
    }

}
const resetPassword = async (req, res) => {
    try {
        var { email, passwordResetToken, newPassword } = req.body;
        console.log(req.body);
        const isExist = await User.findOne(
            {
                where: {
                    email: email,
                    passwordResetToken: passwordResetToken,
                    passwordResetAt:{
                        [Op.gt]: new Date()
                    }
                    
                }
            }
        )
        if (isExist) {

            const { salt, encryptedPassword } = await hashedPassword(newPassword)
            const updateUser = await User.update(
                {
                    password: encryptedPassword,
                    passwordResetToken: null,
                    passwordResetAt: null,
                    salt: salt
                },
                {
                    where: {
                        email: email
                    }
                }
            )
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
        console.log(error);
        return res.status(500).json({
            message: 'error'
        });
    }
}
module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
}