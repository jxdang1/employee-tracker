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

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
    'Quit',
  ]
}

function menu() {
  inquirer.prompt(startMenu).then((answers) => {
      switch (answers.startMenu) {
          //switch statement that runs a function based on what was selected
          case 'View All Employees':
              viewEmployees();
              break;
          case 'Add Employee':
              addEmployeePrompt();
              break;
          case 'Update Employee Role':
              updateEmployeeRole();
              break;
      }
  });
}

// Employee table view

function viewEmployees() {
  db.query(`SELECT * FROM employees`, function (err, result) {
      console.log(result);
      main();
  });
}

// Prompts user of information to add a new employee to employee table
function addEmployeePrompt() {
  inquirer.prompt([
      {
      type: 'input',
      name: 'employeeFirstName',
      message: 'Please enter the first name of the new employee'},
      {
      type: 'input',
      name: 'employeeLastName',
      message: 'Please enter the last name of the new employee'},
      {
      type: 'input',
      name: 'employeeRole',
      message: 'Please enter the role of the new employee'},
      {
      type: 'input',
      name: 'employeeManager',
      message: 'Please enter the last name of the manager of the new employee'},
      ])
      .then((response) => {
          addEmployeeSQL(response.employeeFirstName, response.employeeLastName, response.employeeRole, response.employeeManager);
  })
  
}


// prompts user to input new information about employee to be UPDATED to employee table
function updateEmployeeRole() {
  inquirer.prompt(
      [{
          type: 'input',
          name: 'employeeUpdate',
          message: 'Enter the last name of the employee to update information.'
      },
      {
          type: 'input',
          name: 'updatedRole',
          message: 'Enter the new role for the employee.'
      }
      ]).then((response) => {
          //query to get role ID
          db.query(`SELECT id FROM role WHERE title=?;`, response.updatedRole, function (err, result) {
                  const roleID = result[0].id;
                  const employeeUpdate = response.employeeUpdate;
              //update employee
              db.query(`UPDATE employees SET role_id = ? WHERE last_name = ?;`, [roleID, employeeUpdate], function (err, result) {
                  if (err) {
                      console.log(err);
                  }
                  console.log('Database has been updated!');
                  main();
              })
          })
      })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});