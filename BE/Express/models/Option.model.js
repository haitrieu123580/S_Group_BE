const { Sequelize, DataTypes} = require("sequelize");
const sequelize = require('../database/sequelize')
const Option = sequelize.define('Options', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Polls',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },{
    tableName: 'options',
    timestamps: false
  });
sequelize.sync().then(() => {

    Option.findAll().then(res => {
        console.log(res)
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
    });

}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = Option