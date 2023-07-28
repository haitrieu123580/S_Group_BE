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
module.exports = UserRole