USE employee_db;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 3),
('Mike', 'Chan', 1, 1),
('Ashley', 'Rodriguez', 2, NULL),
('Kevin', 'Tupik', 2, 3),
('Malia', 'Brown', 3, NULL),
('Sarah', 'Lourd', 4, NULL),
('Tom', 'Allen', 4, 6),
('Christian', 'Eckenrode', 2, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);


INSERT INTO departments (name)
VALUES ('Sales'),
('Engineering'),
('Finance'),
('Legal');

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;
