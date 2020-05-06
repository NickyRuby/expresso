const express = require('express');
const employeesRouter = new express.Router();
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite')

const validateEmployee = (req,res,next) => {
    req.name = req.body.employee.name;
    req.position = req.body.employee.position;
    req.wage = req.body.employee.wage;
    req.isCurrentlyEmployee = req.body.isCurrentlyEmployee === 0? 0 : 1;

    if (!req.name || !req.position || !req.wage || !req.wage) {
        res.status(400).send();
    }
    else {
        next();
    }
}

employeesRouter.param('employeeId', (req,res,next,employeeId) => {
    db.get(`SELECT * FROM Employee WHERE id=${employeeId};`, (err,data) => {
        if (!data) {
            res.status(404).send();
        }
        else {
            req.employeeId = employeeId;
            next(); 
        }
    })
})

employeesRouter.get('/', (req,res,next) => {
    db.all(`SELECT * FROM Employee WHERE is_current_employee=1;`,(err, data) => {
        if (err) {
            next(err);
        }
        res.status(200).json({employees: data});
    })
});

employeesRouter.post('/', validateEmployee, (req,res,next) =>{
    db.run(
         `INSERT INTO Employee (name,position, wage,is_current_employee) 
         VALUES ("${req.name}", "${req.position}", ${req.wage}, ${req.isCurrentlyEmployee});
    `, function(err){
         if (err) {
             next(err)
         } else {
             db.get(`SELECT * FROM Employee WHERE id=${this.lastID};`, (err,data) => {
                 res.status(201).json({employee: data});
             });
         }
    })
});

employeesRouter.get('/:employeeId', (req,res,next) => {
    db.get(`SELECT * FROM Employee WHERE id=${req.params.employeeId}`, (err,data) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({employee: data});
        }
    })
})




module.exports = employeesRouter;