const express = require('express');
const menusRouter = new express.Router({mergeParams: true});
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite')

menusRouter.get('/', (req,res,next) => {
    db.all(`SELECT * FROM Menu;`, (err,data) => {
        if (err) {
            next(err);
        }
        res.status(200).json({menus: data});
    })
})

module.exports = menusRouter;