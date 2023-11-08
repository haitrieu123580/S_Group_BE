var con = require('./connection')

con.raw(`CREATE TABLE if not exists users (
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
CONSTRAINT createdBy FOREIGN KEY (createdBy) REFERENCES users (id));`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })

con.raw(`CREATE TABLE if not exists polls (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    question varchar(255) NOT NULL,
    createdBy int NOT NULL,
    PRIMARY KEY (id),
    KEY createdBy_idx (createdBy),
    CONSTRAINT createdBy_idx FOREIGN KEY (createdBy) REFERENCES users (id) ON DELETE CASCADE
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`CREATE TABLE if not exists options (
    id int NOT NULL AUTO_INCREMENT,
    title varchar(255) DEFAULT NULL,
    pollId int NOT NULL,
    PRIMARY KEY (id),
    KEY pollId (pollId),
    CONSTRAINT pollId FOREIGN KEY (pollId) REFERENCES polls (id) ON DELETE CASCADE
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`CREATE TABLE if not exists options_users (
    id int NOT NULL AUTO_INCREMENT,
    optionId int NOT NULL,
    userId int NOT NULL,
    PRIMARY KEY (id),
    KEY userID_idx (userId),
    KEY optionId_idx (optionId),
    CONSTRAINT optionId FOREIGN KEY (optionId) REFERENCES options (id) ON DELETE CASCADE,
    CONSTRAINT userId FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`CREATE TABLE if not exists roles (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY name_UNIQUE (name)
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`CREATE TABLE if not exists users_roles (
    id int NOT NULL AUTO_INCREMENT,
    userId int NOT NULL,
    roleId int NOT NULL,
    PRIMARY KEY (id),
    KEY userId_idx (userId),
    KEY roleId_idx (roleId),
    CONSTRAINT fk_roleId FOREIGN KEY (roleId) REFERENCES roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_userId FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`CREATE TABLE if not exists permissions (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY name_UNIQUE (name)
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`CREATE TABLE if not exists roles_permissions (
    id int NOT NULL AUTO_INCREMENT,
    permissionId int NOT NULL,
    roleId int NOT NULL,
    PRIMARY KEY (id),
    KEY permissionId_idx (permissionId),
    KEY roleId_idx (roleId),
    CONSTRAINT permissionId FOREIGN KEY (permissionId) REFERENCES permissions (id) ON DELETE CASCADE,
    CONSTRAINT roleId FOREIGN KEY (roleId) REFERENCES roles (id) ON DELETE CASCADE
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`CREATE TABLE if not exists permissiongroup (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    permissionid int NOT NULL,
    PRIMARY KEY (id),
    KEY permissionId_idx (permissionId)
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`CREATE TABLE if not exists image (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    data longblob,
    userId int DEFAULT NULL,
    PRIMARY KEY (id),
    KEY userId (userId),
    CONSTRAINT image_ibfk_1 FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );`)
    .then(() => {
        console.log('Bảng đã được tạo hoặc tồn tại.');
    })
    .catch((error) => {
        console.error('Lỗi tạo bảng:', error);
    })
con.raw(`INSERT INTO permissions (name) VALUES 
('Create User'),
('Read User'),
('Update User'),
('Delete User'),
('Set Permission'),
('Create Permission'),
('Delete Permission'),
('Update Permission'),
('Create Role'),
('Delete Role'),
('Update Role'),
('Set Role');
`)
    .then(() => {
        console.log('Insert permission thành công.');
    })
    .catch((error) => {
        console.error('Lỗi:', error);
    })
con.raw(`
INSERT INTO roles (name) VALUES ('admin'),
('moderator'),
('user');
`)
    .then(() => {
        console.log('Insert roles thành công.');
    })
    .catch((error) => {
        console.error('Lỗi:', error);
    })
// con.raw(`
// INSERT INTO roles_permissions (roleId, permissionId) VALUES (1,1),
// (1,2),
// (1,3),
// (1,4),
// (1,5),
// (1,7),
// (1,8),
// (1,9),
// (1,10),
// (1,11),
// (1,12)
// `)
// .then(() => {
//     console.log('Insert roles_permissions thành công.');
// })
// .catch((error) => {
//     console.error('Lỗi:', error);
// })
