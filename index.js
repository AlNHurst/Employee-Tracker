const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'employee_db'
});

// function to view all employees 

const viewEmployees = () => {
    console.log('Viewing all employees...\n');
    let query = connection.query(`
    SELECT employees.first_name, employees.last_name, employees.role_id, employees.manager_id, roles.title, roles.salary, roles.department_id
    FROM employees
    INNER JOIN roles
    ON employees.role_id = roles.id`,
    (err, results) => {
        if (err) throw (err);
        console.table(results);
        connection.end();
    });
};



connection.connect((err) => {
    if (err) throw err;
    viewEmployees();
});