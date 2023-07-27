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
        case "Add Role":
          addRole();
          break;
      }
    });
};

// Function queries all employees
const viewAllEmployee = () => {
  db.query(
    "SELECT e.id, e.first_name, e.last_name, r.title , d.dept_name, r.salary, e.manager_id  FROM employee as e INNER JOIN role as r ON r.id = e.role_id INNER JOIN department as d ON d.id = r.department_id ",
    (err, result) => {
      err ? console.log(err) : console.table(`\n`, result);
    }
  );
  return initQuestion();
};
// Function queries all roles
const viewAllroles = () => {
  db.query(
    "SELECT r.id, r.title, d.dept_name, r.salary FROM role as r JOIN department as d ON d.id = r.department_id",
    (err, result) => {
      err ? console.log(err) : console.table(`\n`, result);
    }
  );
  return initQuestion();
};

// Function queries all departments
const viewAlldepartments = () => {
  console.log(`inside view department`);
  db.query("SELECT * FROM department", (err, result) => {
    err ? console.log(err) : console.table(`\n`, result);
  });
  return initQuestion();
};
// Function adds department
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
    });
};
const addRole = () => {
  // let departments;
  let dept_id;
  let choices;
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      choices = deconstruct(result);
      let options = choices.map((obj) => {
        return obj.dept_name;
      });
      console.log(`Options`, options);
      if (choices) {
        inquirer
          .prompt([
            {
              type: "input",
              name: "title",
              message: "What is the name of the role ?",
            },
            {
              type: "input",
              name: "salary",
              message: "What is the salary for the role ?",
            },
            {
              type: "list",
              name: "dept_name",
              message: "Which department does the role belong to ?",
              choices: [...options],
            },
          ])
          .then(
            (response) =>
              new Promise((resolve, reject) => {
                const { title, salary, dept_name } = response;
                console.log(dept_name);
                db.query(
                  `SELECT id FROM department WHERE dept_name=?`,
                  dept_name,
                  (err, result) => {
                    console.log(`result is ${JSON.stringify(result)}`);
                    err
                      ? console.log(err)
                      : resolve([result[0].id, title, salary]);
                  }
                );
              })
          )
          .then((input_values) => {
            console.log(`input_values is ${input_values}`);
            db.query(
              `INSERT INTO role(department_id, title,salary) VALUES(?, ?, ?)`,
              input_values,
              (err, result) => {
                err
                  ? console.log(err)
                  : console.log(`Added ${input_values[1]} to the database`);
              }
            );
          });
      }
    }
  });
};

// module.exports = questions;
initQuestion();

function deconstruct(arr, emptArr = []) {
  for (let title of arr) {
    emptArr.push(title);
  }
  return emptArr;
}
