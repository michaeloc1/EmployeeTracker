const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '**45Hello01**',
      database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db database.`)
  );
  
  function inquirerLoop(){
    const questions = [ 
        {
        type: 'list',
        name: 'taskList',
        message: 'What would you like to do?',
        choices:[
          'View All Employees',
          'Add Employee',
          'Update Employee Role',
          'Change Employee Manager',
          'Delete an Employee',
          'View All Roles',
          'Add A Role',
          'View All Departments',
          'Add A Department'
        ]
       }
    ]
    inquirer
    .prompt(questions).then((data) => {
        console.log(data)
        addTask(data.taskList)
    })
    }

      function addTask(taskList){
        switch(taskList){
            case 'View All Employees':
                viewEmployees()
                break;
            case 'Add Employee':
                addEmployee()
                break;
            case 'Update Employee Role':
                changeEmployeeRole();
                break;
            case 'View All Roles':
                  viewRoles();
                  break;
            case 'Add A Role':
                  console.log("in add roles")
                  addRoles();
                  break;
            case 'View All Departments':
                  viewDepartments();
                  break;
            case 'Add A Department':
                  addDepartment();
                  break;
            case 'Delete an Employee':
                  deleteEmployee()
                  break;
            case 'Change Employee Manager':
                  changeEmployeeManager();
                  break;

        }
        //inquirerLoop();

      }

      const viewEmployees = () => {
        const makeQuery = `select e.id, e.first_name, e.last_name, role.title, department.name, role.salary, m.first_name as manager_first, m.last_name AS manager_last
        from employee e
        join role on e.role_id = role.id
        join department on role.department_id = department.id
		    left JOIN   employee m on e.manager_id = m.id`
          db.query(makeQuery, function (err, results) {
            console.table(results);
            inquirerLoop()
          });
      }

      const addEmployee = () => {
        let roleTitles = [];
        let managerList = ['none'];
        db.query('select title from role', function (err, results) {
            for(let i = 0; i < results.length; i++){
                roleTitles.push(results[i].title)
            }
           // console.log(roleTitles)
          });
          db.query('select first_name, last_name from employee', function (err, results) {
            for(let i = 0; i < results.length; i++){
                managerList.push(`${results[i].first_name} ${results[i].last_name}`)
            }
           // console.log(roleTitles)
          });

          const questions = [
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the employees first name?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the employees last name?'
            },
            {
                type: 'list',
                name: 'roles',
                message: 'What is the employees role?',
                choices: roleTitles
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who will be the employees manager?",
                choices: managerList
            }
          ]
        inquirer
        .prompt(questions).then((data) => {
            const fullname = data.manager
            const names = fullname.split(' ');
            const strfirstName = names[0];
            const strlastName = names[1];
            
            const makeQuery = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
            VALUES('${data.firstName}', '${data.lastName}',
            (SELECT id FROM role WHERE title = '${data.roles}'), 
            (SELECT e.id
            FROM   employee e
            LEFT JOIN   employee m on e.manager_id = m.id 
            WHERE e.first_name = '${strfirstName}' AND e.last_name = '${strlastName}')
            
            )`

            db.query(makeQuery, function (err, results) {
                if(err){
                    console.log(err)
                }
                else
                viewEmployees();
                inquirerLoop();
            });
        })

    }

    const changeEmployeeRole = () => {
      let roleTitles = [];
      let employeeList = [];
      db.query('select title from role', function (err, results) {
        for(let i = 0; i < results.length; i++){
           roleTitles.push(results[i].title)
        }
      });
      db.query('select first_name, last_name from employee', function (err, results) {
        for(let i = 0; i < results.length; i++){
            employeeList.push(`${results[i].first_name} ${results[i].last_name}`)
        }

      });

      const questions = [
        {
          type: 'input',
          name: 'test',
          message: 'test'
        },
        {
            type: 'list',
            name: 'employee',
            message: 'What is the employees name?',
            choices: employeeList
        },
        {
            type: 'list',
            name: 'roles',
            message: "What will be their new role?",
            choices: roleTitles
        }
      ]

      inquirer
      .prompt(questions).then((data) => {
        const fullname = data.employee;
        const names = fullname.split(' ');
        const strfirstName = names[0];
        const strlastName = names[1];

        const makeQuery = `UPDATE employee e
            JOIN role r
            SET e.role_id = r.id
            WHERE r.title = '${data.roles}'
            AND e.first_name = '${strfirstName}' AND  e.last_name = '${strlastName}'`

            db.query(makeQuery, function (err, results) {
              if(err){
                  console.log(err)
              }
              else
              viewEmployees();
              inquirerLoop();
          });
        
      })
      


    }
    const viewRoles = () => {
      const makeQuery = `SELECT r.id, r.title, r.salary, d.name as department_name
                        FROM role r
                        JOIN department d ON r.department_id = d.id`

                db.query(makeQuery, function (err, results) {
                if(err){
                    console.log(err)
                }
                else
                console.table(results)
                inquirerLoop();
            });
    }

    const addRoles = () => {
          const departmentList =[];
          db.query('select name from department', function (err, results) {
            if(err){
              console.log(err)
            }
            else{
              for(let i = 0; i < results.length; i++){
                  departmentList.push(results[i].name);
            }
            const questions = [
              {
                type: 'input',
                name: 'role',
                message: 'What is the name of the new Role?'
              },
              {
                type: 'input',
                name: 'salary',
                message: 'What will be the salary of the new Role'
              },
              {
                type: 'list',
                name: 'department',
                message: 'What Department will this Role be part of?',
                choices: departmentList
              }
            ]
            inquirer
              .prompt(questions).then((data) => {
                const makeQuery = `INSERT INTO role(title, salary, department_id)
                                  VALUES('${data.role}', '${data.salary}', 
                                  (SELECT id FROM department WHERE name = '${data.department}')
                                  )`

        db.query(makeQuery, function (err, results) {
        if(err){
            console.log(err)
        }
        else
        inquirerLoop();
    });

            })
          }
           
          });

    }

    const viewDepartments = () => {
      const makeQuery = 'SELECT id, name FROM department'
      db.query(makeQuery, function (err, results) {
        if(err){
            console.log(err)
        }
        else
        console.table(results)
        inquirerLoop();
    });

    }

    const addDepartment = () => {
      const questions = [
        {
          type: 'input',
          name: 'name',
          message: 'What will be the name of the new Department?'
        }
      ]
      inquirer
      .prompt(questions).then((data) => {
        const makeQuery = `INSERT INTO department(name)
        VALUES ('${data.name}')`
        db.query(makeQuery, function (err, results) {
          if(err){
              console.log(err)
          }
          else
          viewDepartments();
          inquirerLoop();
      });

      })
    }

    const deleteEmployee = () => {
      const employeeList = []
      db.query('select first_name, last_name from employee', function (err, results) {
        for(let i = 0; i < results.length; i++){
            employeeList.push(`${results[i].first_name} ${results[i].last_name}`)
        }

      });
      const questions = [
        {
          type: 'input',
          name: 'test',
          message: 'test'
        },
        {
          type: 'list',
          name: 'employee',
          message: 'What employee do you want to delete?',
          choices: employeeList
        }
      ]
      inquirer
        .prompt(questions).then((data) => {
          const fullname = data.employee;
          const names = fullname.split(' ');
          const strfirstName = names[0];
          const strlastName = names[1];

          let makeQuery = `SELECT id FROM employee WHERE first_name = '${strfirstName}' and last_name = '${strlastName}'`
          db.query(makeQuery, function (err, results) {
            if(err){
                console.log(err)
            }
          else{
            makeQuery = `SELECT COUNT (*) FROM employee WHERE manager_id = '${results[0].id}'`
            db.query(makeQuery, function (err, results) {
              if(err){
                  console.log(err)
              }
              else{
                let countVal = Object.values(results[0])
                countVal = countVal[0]
                console.log(countVal)
                if(countVal > 0){
                  console.log("This employee is a manager of other employees and cant be deleted")
                }
                else{
                  makeQuery = `DELETE FROM employee WHERE first_name = '${strfirstName}' AND last_name = '${strlastName}'`
                  db.query(makeQuery, function (err, results) {
                    if(err){
                        console.log(err)
                    }
                    else{
                      
                    }

                });
                }
              }
              viewEmployees();
              inquirerLoop();
          });
          
          }

        });


      });
      
      }

    const changeEmployeeManager= () => {
      const employeeList = []
      const managerList = []
      db.query('select first_name, last_name from employee', function (err, results) {
        for(let i = 0; i < results.length; i++){
            employeeList.push(`${results[i].first_name} ${results[i].last_name}`)
        }

      });
      db.query('select first_name, last_name from employee', function (err, results) {
        for(let i = 0; i < results.length; i++){
            managerList.push(`${results[i].first_name} ${results[i].last_name}`)
        }

      });

      const questions = [
        {
          type: 'input',
          name: 'test',
          message: 'test'
        },
        {
          type: 'list',
          name: 'employee',
          message: 'What employee do you want to update Manager?',
          choices: employeeList
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who do you want to be the manager?',
          choices: managerList
        }
      ]
      inquirer
      .prompt(questions).then((data) => {
          const fullname = data.employee;
          const names = fullname.split(' ');
          const strfirstName = names[0];
          const strlastName = names[1];

          const mgrfullname = data.manager;
          const mgrnames = mgrfullname.split(' ');
          const mgrstrfirstName = mgrnames[0];
          const mgrstrlastName = mgrnames[1];
          


          
       const makeQuery = `UPDATE employee e
       JOIN employee m
       SET e.manager_id = m.id
       WHERE m.first_name = '${mgrstrfirstName}' and m.last_name = '${mgrstrlastName}'
       AND e.first_name = '${strfirstName}' AND  e.last_name = '${strlastName}'`
     
        db.query(makeQuery, function (err, results) {
        if(err){
            console.log(err)
        }
        else
        viewEmployees();
        inquirerLoop();
    });
      })
    }

      inquirerLoop();

  
