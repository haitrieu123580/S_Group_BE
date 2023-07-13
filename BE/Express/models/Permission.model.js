const { Sequelize, DataTypes} = require("sequelize");
const sequelize = require('../database/sequelize')
const Permission = sequelize.define('permissions', {
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
    tableName: 'permissions',
    timestamps: false
  });
sequelize.sync().then(() => {

    Permission.findAll().then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });

}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = Permission