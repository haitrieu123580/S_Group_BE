const router = require('express').Router()
const { canAccessBy } = require('../middleware/verifyRoles');
const Permission = require('../utils/allowPermission')
const asyncHandler = require('express-async-handler')
const roleController = require('../controllers/roleController')
router.post('/create-role',canAccessBy(Permission.CreateRole),asyncHandler(roleController.createRole))
router.put('/update-role/:roleId',canAccessBy(Permission.UpdateRole),asyncHandler(roleController.updateRole))
router.delete('/delete-role/:roleId',canAccessBy(Permission.DeletePermission), asyncHandler(roleController.deleteRole))
router.post('/assign-permission/:roleId',canAccessBy(Permission.SetPermission),asyncHandler(roleController.assignPermissionToRole))
module.exports = router