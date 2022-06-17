const inquirer = require("inquirer");
//const { brotliCompressSync } = require("zlib");
const db = require("./db");

const startMenu = {
    name: "functionality",
    message: "Welcome to the employee manager. Please select a task to begin.",
    type: "list",
    choices: [
        "Add an employee",
        //"Update employee",
        "Show all employees",
        "Show all departments",
        "Show all roles",
        "Add a department",
        "Add a role"
        //"Delete an employee"
    ]
};

const addEmployeePrompt = [
    {
        name: "first_name",
        message: "Enter Employee's first name?"
    },
    {
        name: "last_name",
        message: "Enter Employee's last name?"
    },
]

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
        db.query(`SELECT id, title FROM role`).then((managers) => {
            const choices = results.map(role => {
                return {
                    name: role.title,
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
        const roleChoices = results.map(department => {
            return {
                name: department.name,
                value: department.id,
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
            }
        })
}

start()

