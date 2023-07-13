const router = require('express').Router()
const { canAccessBy } = require('../middleware/verifyRoles');
const Permission = require('../utils/allowPermission');
const asyncHandler = require('express-async-handler')
const permissionController = require('../controllers/permissionController')
router.post('/create-permission', canAccessBy(Permission.CreatePermission), asyncHandler(permissionController.createPermission))
router.put('/update-permission/:permissionId',canAccessBy(Permission.UpdatePermission),asyncHandler(permissionController.updatePermission))
router.get('/',asyncHandler(permissionController.getPermission))
router.delete('/delete-permission/:permissionId',canAccessBy(Permission.DeletePermission),asyncHandler(permissionController.deletePermission))
module.exports = router