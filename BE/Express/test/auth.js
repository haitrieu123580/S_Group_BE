const express = require('express');
const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');

const db = require('../database/knex-connection');
const { canAccessBy } = require('../middlewares/auth');
const { cacheService } = require('../services/cache.service');
const permissionCode = require('../constants/permission-code');

const router = express.Router();

const getUserCredentials = ({ id, username }) => {
  const jwtData = {
    id,
    username,
  };

  const jwtSecret = process.env.JWT_SECRET;

  return jsonwebtoken.sign(jwtData, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

router.post('/login', async function (req, res) {
  try {
    const { username } = req.body;
    const user = await db.raw(`SELECT * FROM user WHERE username = ?`, [username]);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const comparePassword = ({ encryptedPassword, password, salt }) => {
      const hashedRawPassword = crypto.pbkdf2Sync(password, salt, 10, 64, `sha512`).toString(`hex`);

      return encryptedPassword === hashedRawPassword;
    };

    const isPasswordValid = comparePassword({
      password: req.body.password,
      encryptedPassword: user.password,
      salt: user.salt,
    });

    if (isPasswordValid) {
      await cacheService.setOneUser(user.id);
// !
      const token = getUserCredentials({
        id: user.id,
        username,
      });

      return res.status(200).json({
        data: {
          token,
        },
        message: 'login success',
      });
    }

    return res.status(401).json({
      message: 'invalid credentials',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'error',
    });
  }
});

router.get(
  '/authorization-test',
  canAccessBy(permissionCode.CanCreateUser, permissionCode.CanReadUser),
  async function (req, res) {
    return res.status(200).json({
      message: 'test authorization successfully',
    });
  }
);



module.exports = router;