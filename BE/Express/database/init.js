var connection = require('./connection')

connection.query(`CREATE TABLE if not exists Users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NULL,
    salt VARCHAR(255) NULL,
    name VARCHAR(255) NULL,
    age INT NULL ,
    gender TINYINT NULL,
    email VARCHAR(255) NULL,
    PRIMARY KEY (id),
    check(age>0)
    )`, (err, result) => {
    console.log(err)
    console.log(result)
})

connection.query(`alter table Users ADD COLUMN passwordResetToken VARCHAR(255)`, (err, result) =>{
    console.log(err);
    console.log(result);
})

connection.query(`alter table Users ADD COLUMN passwordResetAt DATETIME`, (err, result) =>{
    console.log(err);
    console.log(result);
})
// var values = [
//     ['John', 19, true],
//     ['Peter', 20, true],
//     ['Amy', 14, false],
//     ['Hannah', 18, false],
// ];
// connection.query("insert into Users (fullname, age, gender) values ?", [values], (err, result) => {
//     console.log(err)
//     console.log(result);
// });