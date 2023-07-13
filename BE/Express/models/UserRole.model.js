const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../database/sequelize')
const UserRole = sequelize.define('users_roles', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
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
    tableName: 'users_roles',
    timestamps: false
});
sequelize.sync().then(() => {

    UserRole.findAll().then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });

}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = UserRole