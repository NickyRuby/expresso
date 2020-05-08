const express = require('express');
const menuItemsRouter = new express.Router({mergeParams: true});
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite')



menuItemsRouter.get('/', (req,res,next) => {
    db.all(`SELECT * FROM MenuItem WHERE menu_id=${req.menuId};`,(err, data) => {
        if (err) {
            next(err);
        }
        res.status(200).json({menuItems: data});
    })
});

const validateMenuItems = (req,res,next) => {
    req.name = req.body.menuItem.name;
    req.description = req.body.menuItem.description;
    req.inventory = req.body.menuItem.inventory;
    req.price = req.body.menuItem.price;

    if (!req.name || !req.description || !req.inventory || !req.price) {
        res.status(400).send();
    }
    else {
        next();
    }
}

menuItemsRouter.param('menuItemId', (req,res,next,menuItemId) => {
    db.get(`SELECT * FROM Menu WHERE id=${menuItemId}`, (err,data) => {
        if (!data) {
           return res.status(404).send()
        }
        else {
            req.menuItemId = menuItemId;
            next();
        }
    })
});

menuItemsRouter.post('/', validateMenuItems, (req,res,next) =>{
    db.run(
         `INSERT INTO MenuItem (name, description, inventory, price, menu_id) 
         VALUES ("${req.body.menuItem.name}", "${req.body.menuItem.description}", ${req.body.menuItem.inventory}, ${req.body.menuItem.price}, ${req.menuId} );
    `, function(err){
         if (err) {
             next(err)
         } else {
             db.get(`SELECT * FROM MenuItem WHERE id=${this.lastID};`, (err,data) => {
                 res.status(201).json({menuItem: data});
             });
         }
    })
});

menuItemsRouter.put('/:menuItemId', validateMenuItems, (req,res,next) => {
    db.run(`UPDATE MenuItem SET 
    name="${req.body.menuItem.name}", 
    description="${req.body.menuItem.description}", 
    inventory=${req.body.menuItem.inventory}, 
    price=${req.body.menuItem.price},
    menu_id=${req.menuId}
    WHERE id=${req.params.menuItemId};`, function(err) {
        if (err) {
            next(err);
        }
        db.get(`SELECT * FROM MenuItem WHERE id=${req.params.menuItemId}`, (err, data) => {
            res.status(200).json({menuItem: data});
        });
    })
});

menuItemsRouter.delete('/:menuItemId', (req,res,next) => {
    db.run(`DELETE FROM MenuItem WHERE id=${req.params.menuItemId};`, function(err) {
        if (err) {
            next(err);
        }
        res.status(204).send();
    })
});


module.exports = menuItemsRouter;