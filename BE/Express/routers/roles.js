const knex = require('../database/connection')
const roleRouter = require('express').Router()

// CREATE NEW ROLE
roleRouter.post('/create-role', async (req, res) => {
    try {
        const roleName = req.body.roleName;
        const result = await knex('roles').insert({ name: roleName })
        if (!result) {
            return res.status(400).json({
                message: 'Something wrong when creating role',
            });
        }
        else {
            return res.status(200).json({ message: 'Created' })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something wrong when creating role',
        });
    }
})
// UPDATE ROLE
roleRouter.put('/update-role/:roleId', async (req, res) => {
    try {
        const role = await knex('roles').where('id', parseInt(req.params.roleId)).first();
        if (!role) {
            return res.status(404).json({
                message: 'role could not be found',
            });
        }
        await knex('roles')
            .where({ id: parseInt(req.params.roleId) })
            .update({
                name: req.body.name
            })
        return res.status(200).json({ message: 'Update success' });
    } catch (error) {
        return res.status(500).json({ message: 'Something wrong when updating role' })
    }
})

// DELETE ROLE
roleRouter.delete('/delete-role/:roleId', async (req, res) => {
    try {
        knex('roles')
            .where('id', parseInt(req.params.roleId)).first()
            .then((result) => {
                if (result) {
                    return res.status(200).json({ message: 'deleted role' })
                }
                else {
                    return res.json({ message: 'Something wrong when detele role' })
                }
            }).catch((err) => {

            });
    } catch (error) {
        return res.json({ message: 'Something wrong when detele role' })
    }
})
// ASSIGN PERMISSION TO ROLE
roleRouter.post('/assign-permission/:roleId', async (req, res) => {
    try {
        const roleId = parseInt(req.params.roleId)
        const { permissions } = req.body;
        // find existed role
        const role = knex('roles').select().where('id', roleId).first()
        if (!role) {
            return res.status(404).json({ message: 'role not found' })
        }
        const permissionWithRoleId = permissions.map((x) => {
            console.log(x);
            return { roleId: roleId, permissionId: parseInt(x) }
        })
        await knex('roles_permissions')
            .insert(permissionWithRoleId)
        return res.status(201).json({ message: 'assigned perrmission' })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Something wrong when assigning new permission',
        });
    }
})

module.exports = roleRouter