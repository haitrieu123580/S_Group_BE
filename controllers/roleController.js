const Role = require('../models/Role.model')
const RolePermission = require('../models/RolePermission.model')
// CREATE NEW ROLE
const createRole = async (req, res) => {
    try {
        const roleName = req.body.roleName;
        const [role, created] = await Role.findOrCreate({
            where: {
                name: roleName
            },
            defaults:
            {
                name: roleName
            }
        })
        if (created) {
            return res.status(200).json({ message: 'created new role successfully' });
        }
        else {
            return res.json({ message: 'Role existed' });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Something wrong when creating role',
        });
    }
}
// UPDATE ROLE
const updateRole = async (req, res) => {
    try {
        const isExist = await Role.findOne({
            where: {
                id: parseInt(req.params.roleId)
            }
        })
        console.log(isExist);
        if (isExist) {
            const result = await Role.update(
                {
                    name: req.body.name
                },
                {
                    where: {
                        id: parseInt(req.params.roleId)
                    }
                }
            )
            return res.status(200).json({ message: 'role updated' })
        }
        else {
            return res.json({ message: 'Role not found' })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something wrong when updating role' })
    }
}
// DELETE ROLE
const deleteRole = async (req, res) => {
    try {
        const isExist = await Role.findOne({
            where: {
                id: req.params.roleId
            }
        })
        if (isExist === null) {
            return res.json({ message: `role not found` })
        }
        else {
            await isExist.destroy();
            return res.json({ message: `role deleted successfully` })
        }
    } catch (error) {
        return res.status(500).json({ message: 'error' })
    }
}
// ASSIGN PERMISSION TO ROLE
const assignPermissionToRole = async (req, res) => {
    try {
        const roleId = parseInt(req.params.roleId)
        const { permissions } = req.body;
        console.log(permissions);
        const isExist = await Role.findOne({
            where: {
                id: roleId
            }
        });

        console.log(isExist);
        if (!isExist) {
            return res.status(404).json({ message: 'role not found' })
        }
        const permissionWithRoleId = permissions.map((x) => {
            return { roleId: roleId, permissionId: parseInt(x) }
        })
        await RolePermission.bulkCreate(permissionWithRoleId)
        return res.status(201).json({ message: 'assigned permission' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something wrong when assigning new permission',
        });
    }
}

module.exports = {
    createRole,
    updateRole,
    deleteRole,
    assignPermissionToRole
}