const inquirer = require("inquirer");
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
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Quit":
          process.exit(``);
      }
    });
};

// Function queries all employees
const viewAllEmployee = () => {
  new Promise((resolve, reject) => {
    db.query(
      "SELECT e.id, e.first_name, e.last_name, r.title , d.dept_name, r.salary, e.manager_id  FROM employee as e INNER JOIN role as r ON r.id = e.role_id INNER JOIN department as d ON d.id = r.department_id ",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.table(result);
          resolve(`resolved`);
        }
      }
    );
  }).then((res) => {
    res ? initQuestion() : console.log(err);
  });
};

// Function queries all roles
const viewAllroles = () => {
  new Promise((resolve, reject) => {
    db.query(
      "SELECT r.id, r.title, d.dept_name, r.salary FROM role as r JOIN department as d ON d.id = r.department_id",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.table(result);
          resolve(`resolved`);
        }
      }
    );
  }).then((res) => {
    res ? initQuestion() : console.log(err);
  });
};

// Function queries all departments
const viewAlldepartments = () => {
  new Promise((resolve, reject) => {
    db.query("SELECT * FROM department", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.table(result);
        resolve(`resolved`);
      }
    });
  }).then((res) => {
    res ? initQuestion() : console.log(err);
  });
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
// Function adds role
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

// Function add employee
const addEmployee = () => {
  //getting role data
  new Promise((resolve, reject) => {
    db.query(`SELECT id, title FROM role`, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        let choices = result.map((el) => {
          return { name: el["title"], value: el["id"] };
        });
        resolve(choices);
      }
    });
  })
    .then((roles) => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT first_name, last_name, id FROM employee",
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              let employees = result.map((el) => {
                return {
                  name: `${el.first_name} ${el.last_name}`,
                  value: `${el.id}`,
                };
              });
              resolve({ roles: roles, employees: employees });
            }
          }
        );
      });
    })
    .then((response) => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is employee's first name ? ",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is employee's last name ? ",
          },
          {
            type: "list",
            name: "role_id",
            choices: response.roles,
            message: "What role would you like to assign to the employee ?",
          },
          {
            type: "list",
            name: "manager_id",
            choices: [...response.employees, { name: "None", value: null }],
            message: "Who's is the employee's manager ? ",
          },
        ])
        .then((response) => {
          const { first_name, last_name, role_id, manager_id } = response;
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)",
              [first_name, last_name, role_id, manager_id],
              (err, result) => {
                err
                  ? console.log(err)
                  : resolve(`Employee added to database successfully`);
              }
            );
          });
        })
        .then((response) => {
          console.table(response);
          initQuestion();
        });
    });
};

// Function update employee role
const updateEmployeeRole = () => {
  //getting role data
  new Promise((resolve, reject) => {
    db.query(`SELECT id, title FROM role`, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        let choices = result.map((el) => {
          return { name: el["title"], value: el["id"] };
        });
        resolve(choices);
      }
    });
  })
    .then((roles) => {
      return new Promise((resolve, reject) => {
        db.query(
          "SELECT first_name, last_name, id FROM employee",
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              let employees = result.map((el) => {
                return {
                  name: `${el.first_name} ${el.last_name}`,
                  value: `${el.id}`,
                };
              });
              resolve({ roles: roles, employees: employees });
            }
          }
        );
      });
    })
    .then((response) => {
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee_id",
            choices: response.employees,
            message: "Select employee to update the role: ",
          },
          {
            type: "list",
            name: "role_id",
            choices: response.roles,
            message:
              "What role would you like to assign to the selected employee ?",
          },
        ])
        .then((response) => {
          return new Promise((resolve, reject) => {
            db.query(
              `UPDATE employee SET role_id=? WHERE id = ?`,
              [response.role_id, response.employee_id],
              (err, result) => {
                err
                  ? console.log(err)
                  : resolve(`Change of Role was successful`);
              }
            );
          });
        })
        .then((response) => {
          console.log(response);
          initQuestion();
        });
    });
};

function deconstruct(arr, emptArr = []) {
  for (let title of arr) {
    emptArr.push(title);
  }
  return emptArr;
}

module.exports = initQuestion;
// initFunc();
