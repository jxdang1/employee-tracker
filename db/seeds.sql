-- Names of department that will be inserted into department table
INSERT INTO department
  (name)
VALUES
  ('Engineering'),
  ('Sales'),
  ('Finance'),
  ('Legal');

-- Roles of department that will be inserted into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Software Engineer', 85000, 1),
  ('Salesperson', 75000, 2),
  ('Accountant', 125000, 3),
  ('Lawyer', 200000, 4);

-- Employee's first and last name that will be inserted into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Sally', 'Jackson', 1, 4),
  ('Percy', 'Jackson', 2, 3),
  ('Annabeth', 'Chase', 3, 1),
  ('Grover', 'Underwood', 4, 5);