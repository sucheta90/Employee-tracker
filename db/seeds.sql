INSERT INTO department (dept_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Sales"),
       ("Legal");
       
     /*How to get department name by department id */
INSERT INTO role (title,department_id,salary)
VALUES ("Lead Engineer",1,150000),
       ("Salesperson",3,80000),
       ("Account Manager",2, 160000),
       ("Sales Lead",3, 100000),
       ("Software Engineer",1, 120000),
       ("Legal Team Lead",4, 250000),
       ("Accountant",2,125000);
       
INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Elliot", "Smith",1,null ),
       ("Amira", "Afzal",2,4),
       ("Christoper", "Lee",2,4),
       ("Verónica", "Rodriguez", 7,3),
       ("Igor", "Stein",4,null);
       
