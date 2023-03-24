# Employeee Tracker

## Description
This application lets users use a command line interface to add, update, delete, and view employees and their jobs.  This application is simple to use, just follow the prompts.  I wanted an application that was intuative and easy to use.
## Table of Contents
- [Employeee Tracker](#employeee-tracker)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Licence](#licence)
  - [Contributing](#contributing)
  - [Tests](#tests)
  - [Questions](#questions)
  - [Link to Github repository](#link-to-github-repository)
  - [Link to walkthrough Video](#link-to-walkthrough-video)


## Installation
Download the code from my github repository. You will need to install inquirer 8.2.4, console-table 0.10.0, and mysql2 3.2.0.  Inquirer is used for the user input prompts, console-table is used to format the sql tables returned and mysql2 is used to communicate with the database.
## Usage
Once you type node index.js in the command line you are given a list of functions that can be performed.  You can add, update and delete employees, roles, and departments.  The application will not allow delete of employee if the employee is still a manager of other employees. Also, you can not delete roles if their are their are still employees asigned that role. Finally, you cannot delete departments if their are still roles asigned to that department.
You can also view employees by manager and the total budget per department.
## Licence
This project uses the [MIT](https://opensource.org/license/mit/) license.

## Contributing
If you would like to contribute to this project email me at the address below.
## Tests
None at this time.
## Questions
If you have any questions you can contact me at [michaeloc@verizon.net](michaeloc@verizon.net)  
Visit me at [Github](https://github.com/michaeloc1)
## Link to Github repository
[Link](https://github.com/michaeloc1/EmployeeTracker) to Github repository.
## Link to walkthrough Video
[Link](https://www.youtube.com/watch?v=Fi6VVPX6A5I) to walkthrough video.
