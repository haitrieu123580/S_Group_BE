const router = require('express').Router()
const authController = require('../controllers/authController')
const asyncHandler = require('express-async-handler')
const {validateRegisterRequest} = require('../middleware/validation')
router.post('/register',[validateRegisterRequest], asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.post('/forgot-password', asyncHandler(authController.forgotPassword))
router.post('/reset-password', asyncHandler(authController.resetPassword))
module.exports = router