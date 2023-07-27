const mysql2 = require("mysql2");
const db = mysql2.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "sucheta90",
    database: "employees_bd",
  },
  console.log(`Connected to the employess_db database.`)
);

module.exports = db;
