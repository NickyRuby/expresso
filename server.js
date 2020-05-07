const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();
const sqlite = require('sqlite3');
const db = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite')
const PORT = process.env.PORT || 4000;
const employeesRouter = require('./api/employees');
const menusRouter = require('./api/menus');

app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/api/employees', employeesRouter);
app.use('/api/menus', menusRouter);


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})


module.exports = app;