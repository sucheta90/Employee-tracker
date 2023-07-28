const initFunc = require("./scripts/questions"); // The inquirer prompts live inside script. Hence has been imported as a module

var figlet = require("figlet");

new Promise((resolve, reject) => {
  figlet("Employee Tracker", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log("\n");
    console.table(data);
    console.log("\n");
    resolve(`resolved`);
  });
}).then((res) => {
  res ? initFunc() : console.log(err);
});
