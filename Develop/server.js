const inquirer = require("inquirer");
//const { brotliCompressSync } = require("zlib");
const db = require("./db");

const startMenu = {
    name: "functionality",
    message: "Welcome to the employee manager. Please select a task to begin.",
    type: "list",
    choices: [
        "Add an employee",
        "Add a department",
        "Add a role",
        "Update Employee Role",
        "Update Employee Manager",
        "Delete an employee",
        "Delete a department",
        "Delete a role",
        "Show all employees",
        "Show all employees by Manager",
        "Show all departments",
        "Show all roles",
        "Show all employees by Department",
        "Show total Department salary"
    ]
};



const showAllEmployees = () => {
    db.query(`SELECT e1.id as EMP_ID, CONCAT(e1.first_name, " ", e1.last_name) as Name, title as role, salary, department.name as department, IFNULL(CONCAT(e2.first_name, " ", e2.last_name), "No Manager, Boss Status") as Manager FROM employee e1 LEFT JOIN role ON e1.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee e2 ON e1.manager_id=e2.id`).then(results => {
        console.log('---- EMPLOYEES ----')
        console.table(results)
        console.log('---- EMPLOYEES ----')

        setTimeout(start, 3000)
    })
};

const showAllDepartments = () => {
    db.query(`select * from department`).then(results => {
        console.log('---- DEPARTMENTS ----')
        console.table(results)
        console.log('---- DEPARTMENTS ----')

        setTimeout(start, 3000)
    })
};

const showAllRoles = () => {
    db.query(`select role.id,role.title,role.salary,department.name from role left join department on role.department_id = department.id`).then(results => {
        console.log('---- ROLES ----')
        console.table(results)
        console.log('---- ROLES ----')

        setTimeout(start, 3000)
    })
};

const addEmployee = () => {
    db.query(`SELECT id, first_name, last_name FROM employee`).then(results => {
        const managerChoices = results.map(man => {
            return {
                name: `${man.first_name} ${man.last_name}`,
                value: man.id
            }
        })
        db.query(`SELECT id, title FROM role`).then(results => {
            const choices = results.map(role => {                
                return {
                    name: `${role.title}`,
                    value: role.id,
                }
            });
            const addEmployeePrompt = [
                {
                    name: "first_name",
                    message: "Enter Employee's first name?"
                },
                {
                    name: "last_name",
                    message: "Enter Employee's last name?",
                    type: "input"
                },
                {
                    name: "role_id",
                    message: "Enter Employee title",
                    type: "list",
                    choices
                },
                {
                    name: "manager_id",
                    message: "State manager of Employee",
                    type: "list",
                    choices: [...managerChoices, { name: 'Individual is the boss', value: null }]
                }
            ];

            inquirer.prompt(addEmployeePrompt)
                .then(results => {
                    db.query('INSERT into employee SET ?', results)
                        .then(() => setTimeout(start, 3000))
                });
        });
    });
    //inquirer.prompt()
};

const updateEmployee = () => {
    db.query(`SELECT id, first_name, last_name FROM employee`).then(results => {
        const employeeChoices = results.map(man => {
            return {
                name: `${man.first_name} ${man.last_name}`,
                value: man.id
            }
        })
        db.query(`SELECT id, title FROM role`).then(results => {
            const choices = results.map(role => {
                return {
                    name: role.title,
                    value: role.id,
                }
            });
            const updateEmployeePrompt = [
                {
                    name: "id",
                    message: "Choose Employee to update",
                    type: "list",
                    choices: employeeChoices
                },
                {
                    name: "role_id",
                    message: "Select new role",
                    type: "list",
                    choices
                }
            ];

            inquirer.prompt(updateEmployeePrompt)
                .then(results => {                    
                    db.query('update employee SET role_id=? where id=?',[results.role_id,results.id])
                        .then(() => setTimeout(start, 3000))
                        
                });
        });
    });
    
};

function addDepartment() {
    const addDepartmentPrompt = [
        {
            name: "name",
            message: "Enter Department name."
        },
    ];
    inquirer.prompt(addDepartmentPrompt)
        .then(results => {
            db.query('INSERT into department SET ?', results)
                .then(() => setTimeout(start, 3000))
        });
}

function addRole() {

    db.query(`SELECT * FROM department`).then((results) => {
        const roleChoices = results.map(role => {
            return {
                name: role.name,
                value: role.id,
            }
    });
    const addRolePrompt = [
        {
            name: "title",
            message: "Enter role name."
        },
        {
            name: "salary",
            message: "Enter role salary."
        },
        {
            name: "department_id",
            message: "Enter role department.",
            type:"list",
            choices:roleChoices
        },
    ];
    inquirer.prompt(addRolePrompt)        
        .then(results => {            
            db.query('INSERT into role SET ?', results)
                .then(() => setTimeout(start, 3000))
        });


    });
}

const deleteEmployee = () => {
        db.query(`SELECT * FROM employee`).then((output) => {
            const choices = output.map((emp) => {
                return {
                    name: emp.first_name,
                    value: emp.id,
                }
            });
            const deleteEmployeePrompt = [
                {
                    name: "id",
                    message: "Choose Employee to delete",
                    type: "list",
                    choices: choices
                }
            ];

            inquirer.prompt(deleteEmployeePrompt)
                .then(results => {                                       
                    db.query('delete from employee where ?',results)
                        .then(() => setTimeout(start, 3000))
                        
                });
        });

    
};

const deleteDepartment = () => {
        db.query(`SELECT * FROM department`).then((output) => {
            const choices = output.map((dep) => {
                return {
                    name: dep.name,
                    value: dep.id,
                }
            });
            const deleteDepartmentPrompt = [
                {
                    name: "id",
                    message: "Choose Department to delete",
                    type: "list",
                    choices: choices
                }
            ];

            inquirer.prompt(deleteDepartmentPrompt)
                .then(results => {                                       
                    db.query('delete from department where ?',results)
                        .then(() => setTimeout(start, 3000))
                        
                });
        });

    
};

const deleteRole = () => {
        db.query(`SELECT * FROM role`).then((output) => {
            const choices = output.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            });
            const deleteRolePrompt = [
                {
                    name: "id",
                    message: "Choose role to delete",
                    type: "list",
                    choices: choices
                }
            ];

            inquirer.prompt(deleteRolePrompt)
                .then(results => {                                       
                    db.query('delete from role where ?',results)
                        .then(() => setTimeout(start, 3000))
                        
                });
        });

    
};

const updateEmployeeManager = () => {
    db.query(`SELECT id, first_name, last_name FROM employee`).then(results => {
        const employeeChoices = results.map(man => {
            return {
                name: `${man.first_name} ${man.last_name}`,
                value: man.id
            }
        })
       
            
            const updateEmployeeManagerPrompt = [
                {
                    name: "id",
                    message: "Choose Employee to update",
                    type: "list",
                    choices: employeeChoices
                },
                {
                    name: "manager_id",
                    message: "Select new manager",
                    type: "list",
                    choices: employeeChoices
                }
            ];

            inquirer.prompt(updateEmployeeManagerPrompt)
                .then(results => {                    
                    db.query('update employee SET manager_id=? where id=?',[results.manager_id,results.id])
                        .then(() => setTimeout(start, 3000))
                        
                });
     
    });
    
};
const viewAllEmployeeOfManager = () => {
    db.query(`SELECT * FROM employee WHERE manager_id IS NULL`).then(results => {
        const employeeChoices = results.map(man => {
            return {
                name: `${man.first_name} ${man.last_name}`,
                value: man.id
            }
        })
       
            
            const prompt = [
                {
                    name: "manager_id",
                    message: "Choose Manager",
                    type: "list",
                    choices: employeeChoices
                }
            ];

            inquirer.prompt(prompt)
            .then(results => {                                       
               
                db.query(`SELECT * FROM employee WHERE ?`,results).then(results => {
                    console.log('---- EMPLOYEES ----')
                    console.table(results)
                    console.log('---- EMPLOYEES ----')
            
                    setTimeout(start, 3000)
                })
                    
            });
     
    });
    
};

const viewAllEmployeeByDepartment = () => {
    db.query(`SELECT * FROM department`).then(results => {
        const departments = results.map(dep => {
            return {
                name: `${dep.name}`,
                value: dep.id
            }
        })
       
            
            const prompt = [
                {
                    name: "department_id",
                    message: "Choose Department",
                    type: "list",
                    choices: departments
                }
            ];

            inquirer.prompt(prompt)
            .then(results => {                                       
               
                db.query(`select * from employee left join role on employee.role_id = role.id where ?`,results).then(results => {
                    console.log('---- EMPLOYEES ----')
                    console.table(results)
                    console.log('---- EMPLOYEES ----')
            
                    setTimeout(start, 3000)
                })
                    
            });
     
    });
    
};

const viewTotalDepartmentSalary = () => {
    db.query(`SELECT * FROM department`).then(results => {
        const departments = results.map(dep => {
            return {
                name: `${dep.name}`,
                value: dep.id
            }
        })
       
            
            const prompt = [
                {
                    name: "department_id",
                    message: "Choose Department",
                    type: "list",
                    choices: departments
                }
            ];

            inquirer.prompt(prompt)
            .then(results => {                                       
               
                db.query(`select sum(salary) from role where ?`,results).then(results => {
                    console.log('---- TOTAL SALARY ----')
                    console.table(results)
                    console.log('---- TOTAL SALARY ----')
            
                    setTimeout(start, 3000)
                })
                    
            });
     
    });
    
};


function start() {
    inquirer.prompt(startMenu)
        .then(response => {

            switch (response.functionality) {
                case 'Show all employees':
                    return showAllEmployees();
                case "Add an employee":
                    return addEmployee();
                case "Show all departments":
                    return showAllDepartments();
                case "Show all roles":
                    return showAllRoles();
                case "Add a department":
                    return addDepartment();
                case "Add a role":
                    return addRole();
                case "Update Employee Role":
                    return updateEmployee();
                case "Delete an employee":
                    return deleteEmployee();
                case "Delete a department":
                    return deleteDepartment();
                case "Delete a role":
                    return deleteRole();
                case "Update Employee Manager":
                    return updateEmployeeManager();
                case "Show all employees by Manager":
                    return viewAllEmployeeOfManager();
                case "Show all employees by Department":
                    return viewAllEmployeeByDepartment();
                case "Show total Department salary":
                    return viewTotalDepartmentSalary();
            }
        })
}



start()

