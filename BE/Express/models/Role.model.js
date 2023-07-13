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
sequelize.sync().then(() => {

    Role.findAll().then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });

}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = Role