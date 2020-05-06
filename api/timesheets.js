const express = require('express');
const timeSheetsRouter = new express.Router({mergeParams: true});
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite')

timeSheetsRouter.get('/', (req,res,next) => {
    db.all(`SELECT * FROM Timesheet WHERE employee_id=${req.employeeId};`,(err, data) => {
        if (err) {
            next(err);
        }
        res.status(200).json({timesheets: data});
    })
});


timeSheetsRouter.post('/', (req,res,next) =>{
    if (!req.body.timesheet.hours || !req.body.timesheet.rate || !req.body.timesheet.date) {
        res.status(400).send();
    };
    db.run(
         `INSERT INTO Timesheet (hours, rate, date, employee_id) 
         VALUES (${req.body.timesheet.hours}, ${req.body.timesheet.rate}, ${req.body.timesheet.date}, ${req.employeeId});
    `, function(err){
         if (err) {
             next(err)
         } else {
             db.get(`SELECT * FROM Timesheet WHERE id=${this.lastID};`, (err,data) => {
                 res.status(201).json({timesheet: data});
             });
         }
    })
});


module.exports = timeSheetsRouter;