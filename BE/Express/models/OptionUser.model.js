const { Sequelize, DataTypes, literal } = require("sequelize");
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
}, {
  tableName: 'options_users',
  timestamps: false
});

module.exports = OptionUser