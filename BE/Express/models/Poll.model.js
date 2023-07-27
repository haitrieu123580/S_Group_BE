const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../database/sequelize')
const Poll = sequelize.define('Polls', {
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
  question: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'polls',
  timestamps: false
});
module.exports = Poll