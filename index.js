var inquirer = require('inquirer');
const mysql = require('mysql2');

//creates connection to MYSQL database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'root',
      database: 'employees_db'
    }
  );

//initial startMenu prompt
const startMenu = {
    type: 'list',
    name: 'startMenu',
    message: 'What would you like to do?',
    choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Quit'
    ]
}

//shows menu prompt
function menu() {
    inquirer.prompt(startMenu).then((answers) => {
        switch (answers.startMenu) {
            //switch statement to be able to interact with other prompts
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployeePrompt();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add Role':
                addRolePrompt();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'Add Department':
                addDepartmentPrompt();
                break;
            case 'Quit':
                quitProgram();
                break;
        }
    });
}

//views employees table
function viewEmployees() {
    db.query(`SELECT * FROM employees`, function (err, result) {
        console.log(result);
        menu();
    });
}

//views roles table
function viewRoles() {
    db.query(`SELECT * FROM role`, function (err, result) {
        console.log(result);
        menu();
    });
}

//views department table
function viewDepartments() {
    db.query(`SELECT * FROM department`, function (err, result) {
        console.log(result);
        menu();
    });
}

function addEmployeePrompt() {
    inquirer.prompt([
        {
        type: 'input',
        name: 'employeeFirstName',
        message: 'Enter the first name of the new employee'},
        {
        type: 'input',
        name: 'employeeLastName',
        message: 'Enter the last name of the new employee'},
        {
        type: 'input',
        name: 'employeeRole',
        message: 'Enter the role of the new employee'},
        {
        type: 'input',
        name: 'employeeManager',
        message: 'Enter the last name of the manager of the new employee'},
        ])
        .then((response) => {
            addEmployee(response.employeeFirstName, response.employeeLastName, response.employeeRole, response.employeeManager);
    })
    
}
        
//SQL query for adding new employee
function addEmployee(firstName, lastName, role, manager) {
    //getting the role's ID
    db.query(`SELECT id FROM role WHERE title=?;`, role, function (err, result) {
        const roleID = result[0].id;

        //getting manager's ID
        db.query(`SELECT id FROM employees WHERE last_name=?;`, manager, function (err, result) {
            const managerID = result[0].id;

            //inserting into employee table
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?);`, [firstName, lastName, roleID, managerID], function (err, result) {
                if (err) {
                    console.log(err);
                }
                console.log('Database updated!');
                menu();
            })
        })
    })
};

function updateEmployeeRole() {
    //prompt for user input
    inquirer.prompt(
        [{
            type: 'input',
            name: 'employeeToUpdate',
            message: 'Enter the last name of the employee to update.'
        },
        {
            type: 'input',
            name: 'updatedRole',
            message: 'Enter the new role for the employee.'
        }
        ]).then((response) => {
            //query to get role ID
            db.query(`SELECT id FROM role WHERE title=?;`, response.updatedRole, function (err, result) {
                    const updatedRoleID = result[0].id;
                    const employeeToUpdate = response.employeeToUpdate;
                //update employee
                db.query(`UPDATE employees SET role_id = ? WHERE last_name = ?;`, [updatedRoleID, employeeToUpdate], function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Database updated!');
                    menu();
                })
            })
        })
}

//prompts to get info to create new role
function addRolePrompt() {
    inquirer.prompt([
        {
        type: 'input',
        name: 'roleTitle',
        message: 'Enter the title of the new role'},
        {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter the salary of the new role'},
        {
        type: 'input',
        name: 'roleDepartment',
        message: 'Enter the department of the new role'}
        ])
        .then((response) => {
            addRole(response.roleTitle, response.roleSalary, response.roleDepartment);
    })
    
}

//SQL query to add a role
function addRole(title, salary, department) {
    //query to get the department ID
    db.query(`SELECT id FROM department WHERE dept_name=?;`, department, function (err, result) {
        const deptID = result[0].id;

            //inserts new role into role table
            db.query(`INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`, [title, salary, deptID], function (err, result) {
                if (err) {
                   console.log(err);
                }
                console.log('Database updated!');
                menu();
            })
        })
    }

//prompt to get needed info to add department
function addDepartmentPrompt() {
    inquirer.prompt([
        {
        type: 'input',
        name: 'deptartmentName',
        message: 'Please enter the name of the new department'}
        ])
        .then((response) => {
            addDepartment(response.deptartmentName);
    })
}

//SQL query to add a department
function addDepartment(deptName) {
    db.query(`INSERT INTO department (dept_name)
    VALUES (?)`, [deptName], function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('Database updated!');
        menu();
    })
}

//quits program
function quitProgram() {
    process.exit();
}

//initial welcome message
console.log('Welcome to the Employee Management System!');

//runs main function for first time
menu();