const inquirer = require("inquirer");
const cTable = require("console.table");
const table = cTable.getTable;
const db = require("./dbConnection");
// Initial question
const initQuestion = () => {
  inquirer
    .prompt({
      type: "list",
      name: "workflow",
      message: "What would you like to do ?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
      loop: false,
    })
    .then((response) => {
      switch (response.workflow) {
        case "View All Employees":
          viewAllEmployee();
          break;
        case "View All Roles":
          viewAllroles();
          break;
        case "View All Departments":
          viewAlldepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
      }
    });
};

const viewAllEmployee = () => {
  db.query(
    "SELECT e.id, e.first_name, e.last_name, r.title , d.dept_name, r.salary, e.manager_id  FROM employee as e INNER JOIN role as r ON r.id = e.role_id INNER JOIN department as d ON d.id = r.department_id ",
    (err, result) => {
      err ? console.log(err) : console.table(result);
    }
  );
};
const viewAllroles = () => {
  db.query(
    "SELECT r.id, r.title, d.dept_name, r.salary FROM role as r JOIN department as d ON d.id = r.department_id",
    (err, result) => {
      err ? console.log(err) : console.table(result);
    }
  );
};
const viewAlldepartments = () => {
  console.log(`inside view department`);
  db.query("SELECT * FROM department", (err, result) => {
    err ? console.log(err) : console.table(result);
  });
};
const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "dept_name",
      message: "What is the name if the department?",
    })
    .then((response) => {
      if (response.dept_name) {
        db.query(
          "INSERT INTO department(dept_name) VALUES(?)",
          response.dept_name,
          (err, result) => {
            err
              ? console.log(err)
              : console.log(`Added ${response.dept_name} to the database`);
          }
        );
        return initQuestion();
      }
      // console.log(response);
    });
};

// module.exports = questions;
initQuestion();
