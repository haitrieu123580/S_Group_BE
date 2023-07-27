const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../database/sequelize')
const RolePermission = sequelize.define('roles_permissions', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'permissions',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'roles_permissions',
    timestamps: false
});
// sequelize.sync().then(() => {

//     RolePermission.findAll().then(res => {
//         console.log(res)
//     }).catch((error) => {
//         console.error('Failed to retrieve data : ', error);
//     });

// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });
module.exports = RolePermission