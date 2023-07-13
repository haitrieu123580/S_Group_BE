const { Sequelize, DataTypes, literal} = require("sequelize");
const sequelize = require('../database/sequelize')
const User = sequelize.define('Users', {
   id: {
     type: DataTypes.INTEGER.UNSIGNED,
     allowNull: false,
     autoIncrement: true,
     primaryKey: true,
     field: 'id'
   },
   username: {
     type: DataTypes.STRING(255),
     allowNull: false,
     field: 'username'
   },
   password: {
     type: DataTypes.STRING(255),
     allowNull: false,
     field: 'password'
   },
   salt: {
     type: DataTypes.STRING(255),
     defaultValue: null,
     field: 'salt'
   },
   name: {
     type: DataTypes.STRING(255),
     defaultValue: null,
     field: 'name'
   },
   email: {
     type: DataTypes.STRING(255),
     allowNull: false,
     unique: true,
     field: 'email'
   },
   gender: {
     type: DataTypes.TINYINT,
     defaultValue: null,
     field: 'gender'
   },
   age: {
     type: DataTypes.INTEGER,
     defaultValue: null,
     field: 'age'
   },
   passwordResetToken: {
     type: DataTypes.STRING(255),
     defaultValue: null,
     field: 'passwordResetToken'
   },
   passwordResetAt: {
     type: DataTypes.DATE,
     defaultValue: null,
     field: 'passwordResetAt'
   },
   createdBy: {
     type: DataTypes.INTEGER.UNSIGNED,
     defaultValue: null,
     references: {
       model: 'Users',
       key: 'id'
     },
     field: 'createdBy'
   },
   createdAt: {
     type: DataTypes.DATE,
     defaultValue: literal('CURRENT_TIMESTAMP'),
     field: 'createdAt'
   },
   isAdmin: {
     type: DataTypes.TINYINT,
     defaultValue: null,
     field: 'isAdmin'
   }
 }, {
   tableName: 'Users',
   timestamps: false
 });  

// sequelize.sync().then(() => {

//     User.findAll().then(res => {
//         console.log(res)
//     }).catch((error) => {
//         console.error('Failed to retrieve data : ', error);
//     });

// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });
module.exports = User