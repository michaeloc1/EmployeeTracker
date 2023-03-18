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
        choices:['View All Employees', 'Add Employee', 'Update Employee Role']
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
                console.log("Update Employee Role");
                break;
        }
        //inquirerLoop();

      }

      const viewEmployees = () => {
        const makeQuery = `select employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.last_name
        from employee
        join role on employee.role_id = role.id
        join department on role.department_id = department.id;`
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
                inquirerLoop();
            });
        })

    }
      inquirerLoop();

