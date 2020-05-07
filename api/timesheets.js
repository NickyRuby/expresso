const express = require('express');
const timeSheetsRouter = new express.Router({mergeParams: true});
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite')

timeSheetsRouter.param('timesheetId', (req,res,next,timesheetId) => {
    db.get(`SELECT * FROM Timesheet WHERE id=${timesheetId}`, (err,data) => {
        if (!data) {
            res.status(404).send()
        }
        else {
            req.timesheetId = timesheetId;
            next();
        }
    })
})

timeSheetsRouter.get('/', (req,res,next) => {
    db.all(`SELECT * FROM Timesheet WHERE employee_id=${req.employeeId};`,(err, data) => {
        if (err) {
            next(err);
        }
        res.status(200).json({timesheets: data});
    })
});


const validateTimesheet = (req,res,next) => {
    req.hours = req.body.timesheet.hours;
    req.rate = req.body.timesheet.rate;
    req.date = req.body.timesheet.date;

    if (!req.hours || !req.rate || !req.date) {
        res.status(400).send();
    }
    else {
        next();
    }
}


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


timeSheetsRouter.put('/:timesheetId', validateTimesheet, (req,res,next) => {
    db.run(`UPDATE Timesheet SET 
    hours=${req.hours}, 
    rate=${req.rate}, 
    date=${req.date}, 
    employee_id=${req.employeeId} 
    WHERE id=${req.params.timesheetId};`, function(err) {
        if (err) {
            next(err);
        }
        db.get(`SELECT * FROM Timesheet WHERE id=${req.params.timesheetId}`, (err, data) => {
            res.status(200).json({timesheet: data});
        });
    })
});

timeSheetsRouter.delete('/:timesheetId', (req,res,next) => {
    db.run(`DELETE FROM Timesheet WHERE id=${req.params.timesheetId};`, function(err) {
        if (err) {
            next(err);
        }
        res.status(204).send();
    })
});



module.exports = timeSheetsRouter;