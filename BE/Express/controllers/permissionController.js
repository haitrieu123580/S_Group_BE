const Permission = require('../models/Permission.model')
// CREATE NEW PERMISSION
const createPermission = async (req, res) => {
    try {
        const permissionName = req.body.name;
        const [permission, created] = await Permission.findOrCreate({
            where: {
                name: permissionName
            },
            defaults:
            {
                name: permissionName
            }
        })
        if (created) {
            return res.status(200).json({ message: 'created new permission successfully' });
        }
        else {
            return res.json({ message: 'Permission existed' });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Something wrong when creating permission',
        });
    }
}
// UPDATE PERMISSION
const updatePermission = async (req, res) => {
    try {
        const isExist = await Permission.findOne({
            where: {
                id: parseInt(req.params.permissionId)
            }
        })
        if (isExist) {
            const result = await Permission.update(
                {
                    name: req.body.name
                },
                {
                    where: {
                        id: parseInt(req.params.permissionId)
                    }
                }
            )
            return res.status(200).json({ message: 'permission updated' })
        }
        else {
            return res.json({ message: 'permisison not found' })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something wrong when updating permisison' })
    }
}
// READ PERMISSION
const getPermission = async (req, res) => {
    try {
        const result = await Permission.findAll()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: 'Something wrong' })
    }
}
// DELETE PERMISSION
const deletePermission = async (req, res) => {
    try {
        const isExist = await Permission.findOne({
            where: {
                id: parseInt(req.params.permissionId)
            }
        })
        if (isExist === null) {
            return res.json({ message: `permission not found` })
        }
        else {
            await isExist.destroy();
            return res.json({ message: `permission deleted successfully` })
        }
    } catch (error) {
        return res.status(500).json({ message: 'error' })
    }
}
module.exports = {
    createPermission,
    updatePermission,
    deletePermission,
    getPermission
}