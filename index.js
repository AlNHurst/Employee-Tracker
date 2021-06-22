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
    connection.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department
    FROM employees
    INNER JOIN roles
    ON employees.role_id = roles.id
    INNER JOIN departments 
    ON roles.department_id = departments.id`,
        (err, results) => {
            if (err) throw (err);
            console.table(results);
            connection.end();
        });
};

// function to view all departments

const viewDepartments = () => {
    console.log('Viewing departments...\n');
    connection.query(`
    SELECT * FROM departments`,
    (err, results) => {
    if (err) throw (err);
    console.table(results);
    connection.end();
})
};


connection.connect((err) => {
    if (err) throw err;
    viewDepartments();
});