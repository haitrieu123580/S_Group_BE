const { Sequelize, DataTypes} = require("sequelize");
const sequelize = require('../database/sequelize')
const Role = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },{
    tableName: 'roles',
    timestamps: false
  });
module.exports = Role