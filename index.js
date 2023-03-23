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
  //loop through list of tasks 
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
          'View Employees by Manager',
          'View All Roles',
          'Add A Role',
          'Delete a Role',
          'View All Departments',
          'Add A Department',
          'Delete A Department',
          'View Budget by Department',
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
            case 'View Budget by Department':
                  viewDepartmentBudget() 
                  break;
            case 'View Employees by Manager':
                  viewEmpByMan();
                  break;
            case 'Delete a Role':
                  deleteRole();
                  break;
            case 'Delete A Department':
                  deleteDepartment();
                  break;            
        }


      }
      //view all employees
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
      //add an employee
      const addEmployee = () => {
        let roleTitles = [];
        let managerList = [{name: 'none', value: null}];
        db.query('select id, title from role', function (err, results) {
            for(let i = 0; i < results.length; i++){
              const roleObj = {name: results[i].title, value: results[i].id}

                roleTitles.push(roleObj)
            }
           
          });
          db.query('select id, first_name, last_name from employee', function (err, results) {
            for(let i = 0; i < results.length; i++){
              const empObj = {name: results[i]. first_name + ' ' + results[i].last_name, value: results[i].id}
              managerList.push(empObj)
            }

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
              const makeQuery = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                                VALUES('${data.firstName}', '${data.lastName}', ${data.roles}, ${data.manager})`
  
              db.query(makeQuery, function (err, results) {
                  if(err){
                      console.log(err)
                  }
                  else
                  viewEmployees();
                 
              });
          
          });


        })

    }
    //change the role of an employee
    const changeEmployeeRole = () => {
      
      let roleTitles = [];
      let employeeList = [];
      db.query('select id, title from role', function (err, results) {
        for(let i = 0; i < results.length; i++){
          const roleObj = {name: results[i].title, value: results[i].id}

            roleTitles.push(roleObj)
        }
       
      });
      db.query('select id, first_name, last_name from employee', function (err, results) {
        for(let i = 0; i < results.length; i++){
          const empObj = {name: results[i]. first_name + ' ' + results[i].last_name, value: results[i].id}
          employeeList.push(empObj)
        }

        const questions = [
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
             const makeQuery = `UPDATE employee
                                SET role_id = ${data.roles}
                                WHERE id = ${data.employee}`
  
              db.query(makeQuery, function (err, results) {
                if(err){
                    console.log(err)
                }
                else
                viewEmployees();
               
            });
      
      });

      


        
      })
      


    }
    //view all roles
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
    //add a role
    const addRoles = () => {
          const departmentList =[];
          db.query('select id, name from department', function (err, results) {
            if(err){
              console.log(err)
            }
            else{
                for(let i = 0; i < results.length; i++){
                const deptObj = {name: results[i].name, value: results[i].id}
                departmentList.push(deptObj)
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
                                    VALUES('${data.role}', ${data.salary}, ${data.department})`

        db.query(makeQuery, function (err, results) {
        if(err){
            console.log(err)
        }
        else{
          viewRoles()
       // inquirerLoop();
        }
          });

            })
          }
           
          });

    }
    //view all departments
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
    //add a department
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
          //inquirerLoop();
      });

      })
    }
    //delete employee.  Won't allow delete if employee is a manager of other employees
    const deleteEmployee = () => {
      const employeeList = [];
      db.query('select id, first_name, last_name from employee', function (err, results) {
        for(let i = 0; i < results.length; i++){
          const empObj = {name: results[i]. first_name + ' ' + results[i].last_name, value: results[i].id}
          employeeList.push(empObj)
        }
        const questions = [

          {type: 'list',
          name: 'employee',
          message: 'What employee do you want to delete',
          choices: employeeList
        },
    
         ]
         inquirer
         .prompt(questions).then((data) => {
          makeQuery = `SELECT manager_id FROM employee
                      WHERE manager_id = ${data.employee}` 
        db.query(makeQuery, function (err, results) {
          if(err){
          console.log(err)
          }
          else{
            if(results[0]){
              console.log('This employee is a manager to other employees and cannot be deleted');
              inquirerLoop()
            }
            else{
                makeQuery = `DELETE FROM employee
                            WHERE id = ${data.employee}`
                db.query(makeQuery, function (err, results) {
                  if(err){
                  console.log(err)
                  }
                  else
                  viewEmployees();
                  });
            }
          }
          
          });
         })

       
      });
      
      }
      //change employee manager
    const changeEmployeeManager= () => {
      const employeeList = []
      const managerList = [{name: 'none', value: null}];
      db.query('select id, first_name, last_name from employee', function (err, results) {
        for(let i = 0; i < results.length; i++){
          const empObj = {name: results[i]. first_name + ' ' + results[i].last_name, value: results[i].id}
          employeeList.push(empObj)
        }
      

      });
      db.query('select id, first_name, last_name from employee', function (err, results) {
        for(let i = 0; i < results.length; i++){
          const empObj = {name: results[i]. first_name + ' ' + results[i].last_name, value: results[i].id}
          managerList.push(empObj)
        }
        const questions = [

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
         const makeQuery = `UPDATE employee
                            SET manager_id = ${data.manager}
                            WHERE id = ${data.employee}`
       
          db.query(makeQuery, function (err, results) {
          if(err){
              console.log(err)
          }
          else{
          viewEmployees();
          }
      });
        })
       });



    }
    //view each departments budget. Calculated by adding salaries of employees in each department
    const viewDepartmentBudget = () => {
      const makeQuery = `select d.id,  d.name as department_name, COALESCE(sum(r.salary), 0) as budget from role r
      join employee e on e.role_id = r.id
      right join department d on d.id = r.department_id
      group by d.id`
      db.query(makeQuery, function (err, results) {
        if(err){
            console.log(err)
        }
        else
        console.table(results)
        inquirerLoop();
    });
    }
    //view employees by manager.  Only employees who are manager to other employees show up in the list
  const viewEmpByMan = () => {

    db.query('SELECT first_name, last_name, id FROM employee WHERE (id IN (SELECT manager_id FROM employee));', function (err, results) {
    const managerList = []
    for(let i = 0; i < results.length; i++){
      const empObj = {name: results[i]. first_name + ' ' + results[i].last_name, value: results[i].id}
      managerList.push(empObj)
    }
    
     const questions = [

      {type: 'list',
      name: 'manager',
      message: 'Choose a manager to see their employees',
      choices: managerList
    },

     ]
      inquirer
      .prompt(questions).then((data) => {
        makeQuery = `select e.id, e.first_name, e.last_name, role.title, role.salary from employee e
        join role on e.role_id = role.id
        WHERE e.manager_id = ${data.manager}`
      db.query(makeQuery, function (err, results) {
      if(err){
      console.log(err)
      }
      else
      console.table(results)
      inquirerLoop();
      });


      })


    });

  }
  //delete a role. Will not allow delete if employees are still asigned that role
    const deleteRole = () => {
      const roleTitles = [];
      db.query('select id, title from role', function (err, results) {
        for(let i = 0; i < results.length; i++){
          const roleObj = {name: results[i].title, value: results[i].id}

            roleTitles.push(roleObj)
        }
        const questions = [

          {type: 'list',
          name: 'roles',
          message: 'What role do you want to delete',
          choices: roleTitles
        },
    
         ]
         inquirer
         .prompt(questions).then((data) => {
          makeQuery = `SELECT role_id FROM employee
                      WHERE role_id = ${data.roles}` 
        db.query(makeQuery, function (err, results) {
          if(err){
          console.log(err)
          }
          else{
            if(results[0]){
              console.log('This Role has employees and cannot be deleted');
              inquirerLoop()
            }
            else{
                makeQuery = `DELETE FROM role
                            WHERE id = ${data.roles}`
                db.query(makeQuery, function (err, results) {
                  if(err){
                  console.log(err)
                  }
                  else
                  viewRoles();
                  });
            }
          }
          
          });
         })

       
      });



    }
    //delete department.  Will not allow delete if roles are still asigned to department
    const deleteDepartment = () => {
      const deptTitles = [];
      db.query('select id, name from department', function (err, results) {
        for(let i = 0; i < results.length; i++){
          const deptObj = {name: results[i].name, value: results[i].id}

            deptTitles.push(deptObj)
        }
        const questions = [

          {type: 'list',
          name: 'departments',
          message: 'What department do you want to delete',
          choices: deptTitles
        },
    
         ]
         inquirer
         .prompt(questions).then((data) => {
          makeQuery = `SELECT department_id from role
                      WHERE department_id = ${data.departments}` 
        db.query(makeQuery, function (err, results) {
          if(err){
          console.log(err)
          }
          else{
            if(results[0]){
              console.log('This department has roles and cannot be deleted');
              inquirerLoop()
            }
            else{
                makeQuery = `DELETE FROM department
                            WHERE id = ${data.departments}`
                db.query(makeQuery, function (err, results) {
                  if(err){
                  console.log(err)
                  }
                  else
                  viewDepartments();
                  });
            }
          }
          
          });
         })

       
      });



    }
  
    //start application
      inquirerLoop();

  
