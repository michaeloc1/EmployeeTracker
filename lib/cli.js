const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

class CLI {
    constructor() {
      this.title = '';
  
      // Array of task objects e.g. [{ text: string, priority: bool }, ...]
      this.tasks = [];
    }
    run(db) {
      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'taskList',
            message: 'What would you like to do?',
            choices:['View All Employees', 'Add Employee', 'Update Employee Role']
          },
        ])
        .then(({ taskList }) => {
         // this.title = `${name}'s Tasks`;
          return this.addTask(taskList,db);
          //console.log(taskList)
        })
        .then(() => {
          // sort by priority so that priority tasks come before non-priority tasks
        })
        .then(() => console.log('Created tasks.html'))
        .catch((err) => {
          console.log(err);
          console.log('Oops. Something went wrong.');
        });
    }
  
    addTask(taskList,db) {
        switch(taskList){
            case 'View All Employees':
                console.log("View all employees");
                const makeQuery = 
                db.query('SELECT * FROM role', function (err, results) {
                    console.table(results);
                  });
                break;
            case 'Add Employee':
                console.log("Add Employee");
                break;
            case 'Update Employee Role':
                console.log("Update Employee Role");
                break;
        }
        
      return inquirer
         .prompt([
          {
            type: 'input',
            name: 'text',
            message: 'Enter task',
          },
          {
            type: 'confirm',
            name: 'priority',
            message: 'Is this a priority task?',
          },
          {
            type: 'confirm',
            name: 'confirmAddTask',
            message: 'Would you like to add another task?',
          },
        ])
        .then(({ text, priority, confirmAddTask }) => {
          this.tasks.push({ text, priority });
          if (confirmAddTask) {
            return this.addTask();
          }
        });
    }
  }
  
  module.exports = CLI;