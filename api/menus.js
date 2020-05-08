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

menusRouter.param('menuId', (req,res,next,menuId) => {
    db.get(`SELECT * FROM Menu WHERE id=${menuId}`, (err,data) => {
        if (!data) {
            res.status(404).send()
        }
        else {
            req.menuId = menuId;
            next();
        }
    })
});


menusRouter.get('/:menuId', (req,res,next) => {
    db.get(`SELECT * FROM Menu WHERE id=${req.menuId};`, (err,data) => {
        res.status(200).json({menu: data});
    })
});

menusRouter.post('/', (req,res,next) => {
    if (!req.body.menu.title) {
        return res.status(400).send(); // важно разобрать 
    }
    db.run(`INSERT INTO Menu (title) VALUES ("${req.body.menu.title}");`, function(err) {
        if (err) {
            next(err)
        }
        db.get(`SELECT * FROM Menu WHERE id=${this.lastID};`, (err,data) => {
            if (err) {
                next(err);
            } else {
                res.status(201).json({menu: data});
            }
        });
    });
});

menusRouter.put('/:menuId', (req,res,next) => {
    if (!req.body.menu.title) {
        return res.status(400).send();
    }
    db.run(`UPDATE Menu SET title="${req.body.menu.title}" WHERE id=${req.menuId};`, (err,data) => {
        db.get(`SELECT * FROM Menu WHERE id=${req.menuId};`, (err,data) => {
            res.status(200).json({menu: data});
        })
    })
});

menusRouter.delete('/:menuId', (req,res,next) => {
    db.run(`DELETE FROM Menu WHERE id=${req.params.menuId};`, function(err) {
        if (err) {
            next(err);
        }
        res.status(204).send();
    })
});


module.exports = menusRouter;