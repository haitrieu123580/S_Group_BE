var connection = require('./connection')

connection.query(`create table if not exists Users(
                    id INT AUTO_INCREMENT,
                    fullname NVARCHAR(255) not null,
                    age INT,
                    gender BOOLEAN,
                    PRIMARY KEY (id),
                    check(age>0)
                    )`, (err, result) => {
    console.log(err)
    console.log(result)
})

var values = [
    ['John', 19, true],
    ['Peter', 20, true],
    ['Amy', 14, false],
    ['Hannah', 18, false],
];
connection.query("insert into Users (fullname, age, gender) values ?", [values], (err, result) => {
    console.log(err)
    console.log(result);
});