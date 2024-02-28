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
  type = 'list',
  name: 'startMenu',
  message: 'What would you like to do?',
  choices: [
    ''
  ]
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});