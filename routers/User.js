const router = require('express').Router()
const { verifyToken, verifyTokenAndAuthorization } = require('../middleware/verifyToken')
const { validateRegisterRequest } = require("../middleware/validation");
const { canAccessBy } = require("../middleware/verifyRoles");
const Permission = require('../utils/allowPermission');
const asyncHandler = require('express-async-handler')
const userController = require('../controllers/userController')

router.get('/get-users',asyncHandler(userController.getUsers))
router.post('/create-user', [verifyToken, validateRegisterRequest,canAccessBy(Permission.CreateUser)], asyncHandler(userController.createUser))
// router.get('/:id', verifyTokenAndAuthorization, asyncHandler(userController.getUserById))
router.put('/:id', [verifyTokenAndAuthorization, canAccessBy(Permission.UpdateUser)],asyncHandler(userController.updateUser))
router.delete('/:id', [verifyTokenAndAuthorization, canAccessBy(Permission.DeleteUser)],asyncHandler(userController.deleteUser))
router.post('/assign-role/:userId',canAccessBy(Permission.SetRole), asyncHandler(userController.assignRoleToUser))

module.exports = router