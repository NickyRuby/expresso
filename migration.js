const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

db.run(`
    CREATE TABLE IF NOT EXISTS Employee (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        wage INTEGER NOT NULL,
        is_current_employee INTEGER NOT NULL DEFAULT 1
    );
`, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Table Employee created');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS Timesheet (
        id INTEGER PRIMARY KEY,
        hours INTEGER NOT NULL,
        rate INTEGER NOT NULL,
        date INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        FOREIGN KEY (employee_id) REFERENCES Employee(id)
    );
`, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Table Timesheet created');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS Menu (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL
    );
`, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Table Menu created');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS MenuItem (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        inventory INTEGER NOT NULL,
        price INTEGER NOT NULL,
        menu_id INTEGER NOT NULL,
        FOREIGN KEY(menu_id) REFERENCES Menu(id)
    );
`, function(err) {
    if (err) {
        next(err);
    } else {
        console.log('Table MenuItem created');
    }
});