const connection = require("./connection");
const inquirer = require('inquirer');
console.log("Welcome!");

connection.promise().query(`SELECT *
FROM information_schemas.tables
WHERE table_schema = '${process.env.DB_NAME}'
AND table_name = 'department'
`).then(res => {
    console.log('then block', res)
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'View or edit table',
            choices: [
                'View existing departments',
                'Add a deparment',
                'View existing roles',
                'Add role',
                'View existing employees',
                'Add an employee',
                'Update employee role',
                'Exit'
            ]
        }
    ]).then(res => {
        console.log('then block', res)
        switch(res.action) {
            case 'Add department':
              inquirer.prompt([
                 {
                     type: 'input',
                     name: 'name',
                     message: 'What is the name of the department'
                 } 
              ]).then(res => {
                  connection.promise().query(`
                  INSERT INTO department (name)
                  VALUES ('${res.name}')
                  `)
              })
        }
    })
})
    .catch(err => {
        console.log('error block', err)
        connection.promise().query(`
    CREATE DATABASE ${process.env.DB_NAME}
    `).then(res => {
            console.log("Database Created")
            connection.promise().query(`SELECT *
FROM information_schemas.tables
WHERE table_schema = '${process.env.DB_NAME}'
AND table_name = 'department'
`).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        })
    })