const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'employee_db'
});

const viewEmployees = () => {
    console.log('Viewing all employees...\n');
    connection.query('SELECT * FROM employees', (err, results) => {
        if (err) throw (err);
        console.table(results);
        connection.end();
    });
};

connection.connect((err) => {
    if (err) throw err;
    viewEmployees();
  });