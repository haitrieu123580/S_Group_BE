const { Sequelize, DataTypes, literal} = require("sequelize");
const sequelize = require('../database/sequelize')
const OptionUser = sequelize.define('OptionUser', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    optionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Options',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
  },{
    tableName: 'options_users',
    timestamps: false
  });
// sequelize.sync().then(() => {

//     OptionUser.findAll().then(res => {
//         console.log(res)
//     }).catch((error) => {
//         console.error('Failed to retrieve data : ', error);
//     });

// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });
module.exports = OptionUser