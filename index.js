const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'employee_db'
});

// function to start inquirer prompt
const start = () => {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'selections',
            choices: [
                'View Employees',
                'View Departments',
                'View Roles',
                'Add Employees',
                'Add Departments',
                'Add Roles',
                'Update Employee Role'
            ]
        })
        .then((answer) => {
            switch (answer.selections) {
                case 'View Employees':
                    viewEmployees();
                    break;
                case 'View Departments':
                    viewDepartments();
                    break;
                case 'View Roles':
                    viewRoles();
                    break;
                case 'Add Employees':
                    addEmployees();
                    break;
                case 'Add Departments':
                    addDepartment();
                    break;
                case 'Add Roles':
                    addRoles();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
};

// function to update employee's role

const updateRole = () => {
    connection.query('SELECT * FROM employees', (err, results) => {
        if (err) throw (err);
        const employeesArray = results.map((data) => {
            return { name: data.first_name + ' ' + data.last_name, value: data.id }
        });
        console.log(employeesArray);
        connection.query('SELECT * FROM roles', (err, results) => {
            if (err) throw (err);
            const rolesArray = results.map((data) => {
                return { name: data.title, value: data.id }
            });

            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Select employee to update:',
                        name: 'employeeToUpdate',
                        choices: employeesArray
                    },
                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'Select role:',
                        choices: rolesArray
                    },
                ])
                .then((answer) => {
                    connection.query(`UPDATE employees SET ? WHERE ?`,
                        [
                            {
                                role_id: answer.newRole
                            },
                            {
                                id: answer.employeeToUpdate
                            },
                        ],
                        (err, results) => {
                            if (err) throw (err);
                            console.log('Your employee has been updated!');
                            start();
                        });
                });
        });
    });
};

// function to add new Roles
const addRoles = () => {
        connection.query('SELECT * FROM departments', (err, results) => {
            if (err) throw (err);
            const departmentsArray = results.map((data) => {
                return { name: data.name, value: data.id }
            });

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'roleTitle',
                        message: 'Enter the role\'s title:'
                    },
                    {
                        type: 'input',
                        name: 'roleSalary',
                        message: 'Enter the role\'s salary:'
                    },
                    {
                        type: 'list',
                        name: 'departmentId',
                        message: 'Enter the role\'s department:',
                        choices: departmentsArray
                    }
                ])
                .then((answer) => {
                    connection.query(`INSERT INTO roles SET ?`,
                        {
                            title: answer.roleTitle,
                            salary: answer.roleSalary,
                            department_id: answer.departmentId
                        },
                        (err, results) => {
                            if (err) throw (err);
                            console.log('Your role has been added!');
                            start();
                        });
                });
        });
    };

    // function to add new Department
    const addDepartment = () => {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'Enter the department\'s name:'
                }
            ])
            .then((answer) => {
                connection.query(`INSERT INTO departments SET ?`,
                    {
                        name: answer.departmentName
                    },
                    (err, results) => {
                        if (err) throw (err);
                        console.log('Your department has been added!');
                        start();
                    });
            });
    };

    // function to add new Employees 
    const addEmployees = () => {
        connection.query('SELECT * FROM roles', (err, results) => {
            if (err) throw (err);
            const rolesArray = results.map((data) => {
                return { name: data.title, value: data.id }
            });

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Enter employee\'s first name:',
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter employee\'s last name:',
                    },
                    {
                        type: 'list',
                        message: 'Select employee\'s role:',
                        name: 'roleId',
                        choices: rolesArray
                    },
                ])
                .then((answer) => {
                    connection.query(`INSERT INTO employees SET ?`,
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: answer.roleId
                            // manager_id: answer.managerId
                        }, (err, results) => {
                            if (err) throw (err);
                            console.log('Your employee has been added!');
                            start();
                        });
                });
        });
    }

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
                start();
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
                start();
            })
    };

    // function to view all roles
    const viewRoles = () => {
        console.log('Viewing roles...\n');
        connection.query(`
    SELECT roles.id, roles.title, departments.name AS department, roles.salary
    FROM roles
    LEFT JOIN departments
    ON roles.department_id = departments.id`,
            (err, results) => {
                if (err) throw (err);
                console.table(results);
                start();
            })
    };


    connection.connect((err) => {
        if (err) throw err;
        start();
    });