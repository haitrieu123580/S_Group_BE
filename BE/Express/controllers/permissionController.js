const knex = require('../database/connection');
// CREATE NEW PERMISSION
const createPermission = async (req, res) => {
    try {
        const permission = req.body.name;
        const result = await knex('permissions').insert({ name: permission })
        if (!result) {
            return res.status(400).json({
                message: 'Something wrong when creating permission',
            });
        }
        else {
            return res.status(200).json({ message: 'Created' })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something wrong when creating permission',
        });
    }
}
// UPDATE PERMISSION
const updatePermission = async (req, res) => {
    try {
        const role = await knex('permissions').where('id', parseInt(req.params.permissionId)).first();
        if (!role) {
            return res.status(404).json({
                message: 'permission could not be found',
            });
        }
        await knex('permissions')
            .where({ id: parseInt(req.params.permissionId) })
            .update({
                name: req.body.name
            })
        return res.status(200).json({ message: 'Update success' });
    } catch (error) {
        return res.status(500).json({ message: 'Something wrong when updating permission' })
    }
}
// READ PERMISSION
const getPermission = async (req, res) => {
    try {
        const result = await knex.select().from('permissions')
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: 'Something wrong' })
    }
}
// DELETE PERMISSION
const deletePermission = async (req, res) => {
    try {
        const perrmission = await knex('permissions')
            .where('id', parseInt(req.params.permissionId))
            .first();
        if (!perrmission) {
            return res.status(404).json({
                message: 'permission could not be found',
            });
        }
        const response = await knex('permissions').where({ id: parseInt(req.params.permissionId) }).del();
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error when connect to mysql' });
    }
}
module.exports = {
    createPermission, 
    updatePermission, 
    deletePermission, 
    getPermission
}