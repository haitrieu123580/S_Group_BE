var connection = require('./connection')

connection.query(`CREATE TABLE if not exists Users (
    id int NOT NULL AUTO_INCREMENT,
username varchar(255) NOT NULL,
password varchar(255) NOT NULL,
salt varchar(255) DEFAULT NULL,
name varchar(255) DEFAULT NULL,
email varchar(255) NOT NULL,
gender tinyint DEFAULT NULL,
age int DEFAULT NULL,
passwordResetToken varchar(255) DEFAULT NULL,
passwordResetAt datetime DEFAULT NULL,
createdBy int DEFAULT NULL,
createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
isAdmin tinyint DEFAULT NULL,
PRIMARY KEY (id),
UNIQUE KEY email_UNIQUE (email),
UNIQUE KEY username_UNIQUE (username),
KEY createdBy_idx (createdBy),
CONSTRAINT createdBy FOREIGN KEY (createdBy) REFERENCES users (id)
    )`, (err, result) => {
    console.log(err)
    console.log(result)
})

connection.query(`CREATE TABLE if not exists polls (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    question varchar(255) NOT NULL,
    createdBy int NOT NULL,
    PRIMARY KEY (id),
    KEY createdBy_idx (createdBy),
    CONSTRAINT createdBy_idx FOREIGN KEY (createdBy) REFERENCES users (id) ON DELETE CASCADE
    )`, (err, result) => {
    console.log(err)
    console.log(result)
})
connection.query(`CREATE TABLE if not exists options (
    id int NOT NULL AUTO_INCREMENT,
    title varchar(255) DEFAULT NULL,
    pollId int NOT NULL,
    PRIMARY KEY (id),
    KEY pollId (pollId),
    CONSTRAINT pollId FOREIGN KEY (pollId) REFERENCES polls (id) ON DELETE CASCADE
    )`, (err, result) => {
    console.log(err)
    console.log(result)
})
connection.query(`CREATE TABLE if not exists options_users (
    id int NOT NULL AUTO_INCREMENT,
    optionId int NOT NULL,
    userId int NOT NULL,
    PRIMARY KEY (id),
    KEY userID_idx (userId),
    KEY optionId_idx (optionId),
    CONSTRAINT optionId FOREIGN KEY (optionId) REFERENCES options (id) ON DELETE CASCADE,
    CONSTRAINT userId FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    )`, (err, result) => {
    console.log(err)
    console.log(result)
})

connection.query(`CREATE TABLE if not exists roles (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id),
    )`, (err, result) => {
    console.log(err)
    console.log(result)
})