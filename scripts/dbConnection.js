const mysql2 = require("mysql2");
const db = mysql2.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "sucheta90",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

module.exports = db;
